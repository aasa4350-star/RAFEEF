#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
تقرير أسبوعي تلقائي لمستوى الأبناء — يقرأ نتائج جدول attempts (المسحوبة في results/attempts.json)
ويكتب ملخّصًا في results/weekly-report.md.

المنطق مطابق لصفحة report.html والقرارات المتّفق عليها:
- يستبعد الجلسات غير الموثوقة (meta.trusted === false).
- يفصل التحصيلي وSTEP كـ«فوق المستوى» فلا تُحسب في تقييم الابن (قرار الخيار ٢).
- لا يقارن الأبناء ببعض — كل ابن في قسمه المستقل.
- يحسب الاتجاه: معدّل آخر ٧ أيام مقابل الـ٧ التي قبلها.
"""
import json, os, sys, datetime, collections

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, "results", "attempts.json")
OUT = os.path.join(ROOT, "results", "weekly-report.md")

KIDS = ["سعود", "أسامة", "رفيف", "حسن"]
GRADES = {"سعود": "رابع ابتدائي", "أسامة": "خامس ابتدائي",
          "رفيف": "ثاني متوسط", "حسن": "ثالث متوسط"}


def is_stretch(m):
    """التحصيلي وSTEP فوق المستوى (ثانوي) ولا تدخل التقييم."""
    if m.get("stretch") is True:
        return True
    t = m.get("test") or ""
    return ("تحصيلي" in t) or ("STEP" in t)


def parse_ts(row):
    s = row.get("created_at")
    if not s:
        return None
    try:
        return datetime.datetime.fromisoformat(s.replace("Z", "+00:00"))
    except Exception:
        return None


def score_of(row):
    """يرجع (صحيحة, الكل, اسم الاختبار) من الصف — يدعم شكلي التخزين."""
    m = row.get("meta") or {}
    if isinstance(m.get("total"), int) and m.get("total"):
        return int(m.get("correct") or 0), int(m["total"]), (m.get("test") or "غير مسمّى")
    en_t, ma_t = row.get("en_total") or 0, row.get("ma_total") or 0
    if (en_t + ma_t) > 0:
        c = (row.get("en_correct") or 0) + (row.get("ma_correct") or 0)
        return int(c), int(en_t + ma_t), "اختبر نفسك (إنجليزي+رياضيات)"
    return None


def pct(c, t):
    return round(100 * c / t) if t else 0


def child_section(name, rows, now):
    lines = []
    lines.append("## %s — %s" % (name, GRADES.get(name, "")))

    trusted = [r for r in rows if (r.get("meta") or {}).get("trusted") is not False]
    skipped = len(rows) - len(trusted)

    cutoff7 = now - datetime.timedelta(days=7)
    cutoff14 = now - datetime.timedelta(days=14)

    # تجميع الأداء حسب الاختبار، مع فصل «فوق المستوى»
    in_level = collections.defaultdict(lambda: [0, 0, 0])   # correct,total,sessions
    stretch = collections.defaultdict(lambda: [0, 0, 0])
    week_c = week_t = prev_c = prev_t = 0
    sessions_week = 0
    for r in trusted:
        sc = score_of(r)
        if not sc:
            continue
        c, t, test = sc
        m = r.get("meta") or {}
        bucket = stretch if is_stretch(m) else in_level
        bucket[test][0] += c
        bucket[test][1] += t
        bucket[test][2] += 1
        # الاتجاه يُحسب من مهارات المستوى فقط
        if not is_stretch(m):
            ts = parse_ts(r)
            if ts:
                if ts >= cutoff7:
                    week_c += c; week_t += t; sessions_week += 1
                elif ts >= cutoff14:
                    prev_c += c; prev_t += t

    if not in_level and not stretch:
        lines.append("_لا توجد نتائج مسجّلة بعد._\n")
        return "\n".join(lines)

    tot_c = sum(v[0] for v in in_level.values())
    tot_t = sum(v[1] for v in in_level.values())
    lines.append("")
    lines.append("- **المعدّل العام (في مستوى صفّه): %d%%** — %d/%d سؤال · %d جلسة هذا الأسبوع."
                 % (pct(tot_c, tot_t), tot_c, tot_t, sessions_week))

    # الاتجاه
    if week_t >= 5 and prev_t >= 5:
        d = pct(week_c, week_t) - pct(prev_c, prev_t)
        if d >= 8:
            lines.append("- الاتجاه: 📈 تحسّن %d نقطة عن الأسبوع اللي قبله." % d)
        elif d <= -8:
            lines.append("- الاتجاه: 📉 تراجع %d نقطة — يحتاج انتباه." % abs(d))
        else:
            lines.append("- الاتجاه: ➡️ ثابت تقريبًا.")

    if skipped:
        lines.append("- ⚠️ استُبعدت %d جلسة غير موثوقة (خروج من الصفحة أو سرعة مريبة)." % skipped)

    # الأداء حسب الاختبار (في المستوى) — من الأضعف
    ordered = sorted(in_level.items(), key=lambda kv: pct(kv[1][0], kv[1][1]))
    lines.append("")
    lines.append("| الاختبار | النسبة | (صحيحة/الكل) |")
    lines.append("|---|---|---|")
    for test, (c, t, s) in ordered:
        flag = " ⚠️" if pct(c, t) < 60 else (" 💪" if pct(c, t) >= 90 else "")
        lines.append("| %s | **%d%%**%s | %d/%d |" % (test, pct(c, t), flag, c, t))

    # أضعف نقطة صريحة
    weak = [(test, pct(c, t)) for test, (c, t, s) in in_level.items() if t >= 5]
    weak.sort(key=lambda x: x[1])
    if weak:
        lines.append("")
        lines.append("**🎯 ركّزوا على:** " + " · ".join("%s (%d%%)" % (w[0], w[1]) for w in weak[:3]))

    # فوق المستوى — للعلم فقط، بلا حساب
    if stretch:
        sc = sum(v[0] for v in stretch.values()); st = sum(v[1] for v in stretch.values())
        lines.append("")
        lines.append("> 🚀 **فوق المستوى (تهيئة مبكرة — لا تُحسب):** تحصيلي/STEP %d/%d = %d%%. "
                     "طبيعي تكون أقل، لأنها مادة ثانوي أعلى من صفّه." % (sc, st, pct(sc, st)))

    lines.append("")
    return "\n".join(lines)


def main():
    try:
        with open(SRC, encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        print("تعذّر قراءة %s: %s" % (SRC, e), file=sys.stderr)
        data = []
    if not isinstance(data, list):
        data = []

    now = datetime.datetime.now(datetime.timezone.utc)
    ksa = now + datetime.timedelta(hours=3)

    out = []
    out.append("# 📊 التقرير الأسبوعي — مستوى الأبناء")
    out.append("")
    out.append("_تاريخ التقرير: %s (توقيت السعودية) · تلقائي كل سبت._" % ksa.strftime("%Y-%m-%d %H:%M"))
    out.append("")
    out.append("إجمالي النتائج المقروءة: %d محاولة. لا تُقارَن نسب الأبناء ببعض — كل واحد يُقاس في مستوى صفّه.\n" % len(data))

    by_child = collections.defaultdict(list)
    for r in data:
        by_child[r.get("student")].append(r)

    for name in KIDS:
        out.append(child_section(name, by_child.get(name, []), now))
        out.append("\n---\n")

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        f.write("\n".join(out))
    print("كُتب التقرير في %s" % OUT)


if __name__ == "__main__":
    main()
