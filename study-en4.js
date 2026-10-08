/* ═══ احفظ · ثبّت · جمل — داخل كلِّ وحدةٍ في english.html ═══════════════
   طلبُ الأب (٨ أكتوبر ٢٠٢٦): «في كلّ درس حطّ حفظ كلماته وجمله، وحطّ
   تثبيت، وتمارين على الجمل وترتيب الكلمات».

   المادّةُ من book-en4.js (منقولةٌ من صفحاتِ الكتاب)، لا من بنكِ الأسئلة،
   فما يحفظه الطفلُ هو ما في كتابه.

   - احفظ: قائمةُ الكلمات والجمل بأقسامِ الكتاب، مع 🔊، و«غطِّ المعنى».
   - ثبّت: سؤالُ معنى (اختيار) على صناديقِ التكرار المتباعد: ما يُصيبه
     يرجع بعد ١ ثمّ ٣ ثمّ ٧ ثمّ ١٤ يومًا، وما يُخطئه يرجع في الجولةِ نفسِها
     ثمّ من الغد. الحالةُ في localStorage لكلِّ طفلٍ على حدة.
   - جمل: ترتيبُ الكلمات وإكمالُ الفراغ من جملِ الوحدة.
   النتائجُ تُحفظ في التقرير كغيرها (saveScore). */
(function(){
  var DAY = 864e5, GAPS = [0, 1, 3, 7, 14, 30];   /* أيّامُ كلِّ صندوق */

  function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
  function shuf(a){ for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; } return a; }
  function words(s){ return String(s).trim().split(/\s+/).filter(Boolean); }
  function isSentence(e){ return /[.?!]$/.test(e) && words(e).length >= 3; }
  function say(t){ try{ (window.azureSpeak || window.speakEN)(String(t).replace(/[«»…]/g,"")); }catch(e){} }

  /* عناصرُ الحفظ: الكلماتُ والعبارات (لا الجمل ولا سطورُ القواعد) */
  function vocab(unit){
    var seen = {}, out = [];
    unit.sections.forEach(function(s){
      s.items.forEach(function(it){
        var e = it[0], a = it[1];
        if(isSentence(e) || /^قاعدة/.test(a) || /[؀-ۿ]/.test(e)) return;
        a = a.replace(/^(منتظم|شاذ):\s*/, "");
        if(seen[e]) return; seen[e] = 1; out.push([e, a]);
      });
    });
    return out;
  }
  /* الجمل: تُقسَم السؤالُ والجوابُ عند « — » فكلٌّ منهما جملة */
  function sentences(unit){
    var seen = {}, out = [];
    unit.sections.forEach(function(s){
      s.items.forEach(function(it){
        if(!isSentence(it[0]) && !/ — /.test(it[0])) return;
        it[0].split(/ — /).forEach(function(p, k, all){
          p = p.trim();
          if(!isSentence(p) || /[\/…→]/.test(p) || words(p).length > 10 || seen[p]) return;
          seen[p] = 1; out.push([p, all.length > 1 ? it[1] : it[1]]);
        });
      });
    });
    return out;
  }

  /* ── حالةُ التثبيت: مفتاحٌ لكلِّ طفلٍ ووحدة ── */
  function memKey(id){ return "memo_en4_" + (window.who || "saud") + "_" + id; }
  function memLoad(id){ try{ return JSON.parse(localStorage.getItem(memKey(id))) || {}; }catch(e){ return {}; } }
  function memSave(id, m){ try{ localStorage.setItem(memKey(id), JSON.stringify(m)); }catch(e){} }

  var CSS = ''+
  '.st-bar{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 14px}'+
  '.st-bar button{flex:1;min-width:76px;border:1.5px solid var(--line);background:var(--card);color:var(--ink);padding:10px 4px;border-radius:12px;font-weight:800;font-size:.9rem;cursor:pointer;font-family:inherit}'+
  '.st-bar button.on{background:var(--good);border-color:var(--good);color:#fff}'+
  '.st-sec{background:var(--card);border:1px solid var(--line);border-radius:14px;margin-bottom:12px;box-shadow:var(--shadow);overflow:hidden}'+
  '.st-sec h4{margin:0;padding:10px 14px;background:var(--bg);font-size:.95rem;color:var(--accent)}'+
  '.st-row{display:flex;align-items:center;gap:8px;padding:8px 12px;border-top:1px solid var(--line)}'+
  '.st-row .e{flex:1;direction:ltr;text-align:left;font-weight:800;unicode-bidi:isolate}'+
  '.st-row .a{flex:1;color:var(--muted);font-size:.95rem}'+
  '.st-row .a.hid{color:transparent;background:var(--bg);border-radius:8px;cursor:pointer;user-select:none}'+
  '.st-row .a.hid::after{content:"اضغط للمعنى";color:var(--muted);font-size:.8rem}'+
  '.st-sp{border:0;background:var(--accent);color:#fff;border-radius:9px;padding:5px 9px;cursor:pointer;font-size:.9rem}'+
  '.st-tools{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}'+
  '.st-tools button{border:1.5px solid var(--accent);background:transparent;color:var(--accent);padding:8px 12px;border-radius:11px;font-weight:800;cursor:pointer;font-family:inherit}'+
  '.st-tools button.on{background:var(--accent);color:#fff}'+
  '.st-card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:16px;box-shadow:var(--shadow);margin-bottom:12px}'+
  '.st-big{font-size:1.45rem;font-weight:800;text-align:center;margin:6px 0 12px}'+
  '.st-big.en{direction:ltr}'+
  '.st-opts{display:grid;gap:8px}'+
  '.st-opts button{border:1.5px solid var(--line);background:transparent;color:var(--ink);padding:12px;border-radius:12px;font-size:1.02rem;cursor:pointer;font-family:inherit}'+
  '.st-opts button.en{direction:ltr}'+
  '.st-opts button.ok{background:var(--good-bg);border-color:var(--good);color:var(--good);font-weight:800}'+
  '.st-opts button.no{background:var(--bad-bg);border-color:var(--bad);color:var(--bad)}'+
  '.st-prog{font-size:.85rem;color:var(--muted);text-align:center;margin-bottom:8px}'+
  '.st-meter{height:8px;background:var(--bg);border-radius:6px;overflow:hidden;margin:6px 0 2px}'+
  '.st-meter i{display:block;height:100%;background:var(--good)}'+
  '.st-chips{display:flex;flex-wrap:wrap;gap:8px;direction:ltr;justify-content:center;min-height:48px;padding:8px;border-radius:12px}'+
  '.st-chips.built{background:var(--bg);border:1.5px dashed var(--line)}'+
  '.st-chips button{border:1.5px solid var(--accent);background:var(--card);color:var(--ink);padding:8px 12px;border-radius:10px;font-size:1.05rem;font-weight:700;cursor:pointer;font-family:inherit}'+
  '.st-fb{text-align:center;font-weight:800;margin-top:10px;min-height:1.6em}'+
  '.st-act{display:flex;gap:8px;margin-top:12px}'+
  '.st-act button{flex:1;border:0;background:var(--accent);color:#fff;padding:11px;border-radius:12px;font-weight:800;cursor:pointer;font-family:inherit}'+
  '.st-act button.ghost{background:transparent;border:1.5px solid var(--accent);color:var(--accent)}'+
  '.st-hint{color:var(--muted);text-align:center;font-size:.95rem}';

  function injectCss(){
    if(document.getElementById("st-css")) return;
    var s = document.createElement("style"); s.id = "st-css"; s.textContent = CSS; document.head.appendChild(s);
  }

  /* ════════ 📖 احفظ ════════ */
  function learn(box, id, unit){
    var hide = false;
    function draw(){
      var h = '<div class="intro"><b>📖 احفظ:</b> كلماتُ الوحدة وجملُها من كتابك. اسمع كلَّ كلمةٍ 🔊 وردِّدها، ثمّ غطِّ المعنى واختبر نفسك.</div>'+
        '<div class="st-tools"><button data-hide class="'+(hide?'on':'')+'">'+(hide?'👀 أظهر المعاني':'🙈 غطِّ المعنى')+'</button></div>';
      unit.sections.forEach(function(s){
        h += '<div class="st-sec"><h4>'+esc(s.t)+'</h4>';
        s.items.forEach(function(it){
          var rtl = /[؀-ۿ]/.test(it[0]);
          h += '<div class="st-row">'+
            (rtl ? '' : '<button class="st-sp" data-say="'+esc(it[0])+'">🔊</button>')+
            '<span class="e"'+(rtl?' style="direction:rtl;text-align:right"':'')+'>'+esc(it[0])+'</span>'+
            '<span class="a'+(hide?' hid':'')+'">'+esc(it[1])+'</span></div>';
        });
        h += '</div>';
      });
      box.innerHTML = h;
      box.querySelector("[data-hide]").onclick = function(){ hide = !hide; draw(); };
      box.querySelectorAll("[data-say]").forEach(function(b){ b.onclick = function(){ say(b.dataset.say); }; });
      box.querySelectorAll(".a.hid").forEach(function(a){ a.onclick = function(){ a.classList.remove("hid"); }; });
    }
    draw();
  }

  /* ════════ 🔁 ثبّت ════════ */
  function memo(box, id, unit){
    var V = vocab(unit);
    function stats(){
      var m = memLoad(id), now = Date.now(), learned = 0, due = 0;
      V.forEach(function(v){ var s = m[v[0]]; if(s && s.b >= 3) learned++; if(!s || s.due <= now) due++; });
      return { learned: learned, due: due, total: V.length };
    }
    function home(){
      var st = stats(), pct = Math.round(st.learned / st.total * 100);
      box.innerHTML = '<div class="intro"><b>🔁 ثبّت:</b> سؤالٌ سريعٌ عن معنى كلِّ كلمة. ما تعرفه يرجع لك بعد أيّام لتتأكّد أنّه ثبت، وما تخطئ فيه يرجع لك اليوم وبكرة.</div>'+
        '<div class="st-card"><div>ثبّتَّ <b>'+st.learned+'</b> من <b>'+st.total+'</b> كلمة</div>'+
        '<div class="st-meter"><i style="width:'+pct+'%"></i></div>'+
        '<div class="st-hint" style="margin-top:8px">'+(st.due ? 'عليك اليوم <b>'+st.due+'</b> كلمة' : '🎉 خلّصت كلمات اليوم! ارجع بكرة')+'</div>'+
        '<div class="st-act"><button data-go>'+(st.due ? 'ابدأ (١٠ كلمات) ▶' : 'راجع على كل حال ▶')+'</button></div></div>';
      box.querySelector("[data-go]").onclick = function(){ round(st.due === 0); };
    }
    function round(force){
      var m = memLoad(id), now = Date.now();
      var due = V.filter(function(v){ var s = m[v[0]]; return !s || s.due <= now; });
      /* القديمُ المستحقُّ أوّلًا، ثمّ الجديد */
      due.sort(function(a, b){ var sa = m[a[0]], sb = m[b[0]]; return (sa ? 0 : 1) - (sb ? 0 : 1); });
      var pick = (force || !due.length) ? shuf(V.slice()).slice(0, 10) : due.slice(0, 10);
      pick = shuf(pick);
      var queue = pick.map(function(v){ return { v: v, rev: Math.random() < .35 }; });
      var firstTry = {}, right = 0, done = 0, n = pick.length, pid = window.newPid ? newPid() : null, t0 = Date.now();
      var label = "تثبيت إنجليزي " + id.replace("u", "و") + " 🔁";
      function next(){
        if(!queue.length) return finish();
        var q = queue.shift(), v = q.v;
        var pool = shuf(V.filter(function(x){ return x[0] !== v[0] && x[1] !== v[1]; })).slice(0, 3);
        var opts = shuf(pool.concat([v]));
        var h = '<div class="st-prog">'+done+' / '+n+'</div><div class="st-card">';
        if(q.rev){
          h += '<div class="st-hint">وش هي بالإنجليزي؟</div><div class="st-big">'+esc(v[1])+'</div><div class="st-opts">';
          opts.forEach(function(o, k){ h += '<button class="en" data-k="'+k+'">'+esc(o[0])+'</button>'; });
        } else {
          h += '<div class="st-hint">وش معناها؟ <button class="st-sp" data-say>🔊</button></div><div class="st-big en">'+esc(v[0])+'</div><div class="st-opts">';
          opts.forEach(function(o, k){ h += '<button data-k="'+k+'">'+esc(o[1])+'</button>'; });
        }
        h += '</div><div class="st-fb"></div></div>';
        box.innerHTML = h;
        var sp = box.querySelector("[data-say]"); if(sp){ sp.onclick = function(){ say(v[0]); }; say(v[0]); }
        var answered = false;
        box.querySelectorAll(".st-opts button").forEach(function(b){
          b.onclick = function(){
            if(answered) return; answered = true;
            var ok = opts[+b.dataset.k] === v, fb = box.querySelector(".st-fb");
            box.querySelectorAll(".st-opts button").forEach(function(x){ x.disabled = true; if(opts[+x.dataset.k] === v) x.classList.add("ok"); });
            if(!ok) b.classList.add("no");
            var mm = memLoad(id), s = mm[v[0]] || { b: 0, due: 0 };
            if(!(v[0] in firstTry)){ firstTry[v[0]] = ok; if(ok) right++; done++;
              /* الصندوقُ يتحرّك بالمحاولةِ الأولى فقط في الجولة */
              s.b = ok ? Math.min(s.b + 1, GAPS.length - 1) : 0;
              s.due = Date.now() + (ok ? GAPS[s.b] * DAY : DAY);
              mm[v[0]] = s; memSave(id, mm);
            }
            if(!ok) queue.push({ v: v, rev: !q.rev });   /* يرجع في نفسِ الجولة */
            fb.style.color = ok ? "var(--good)" : "var(--bad)";
            fb.innerHTML = (ok ? "✅ صح! " : "❌ ") + '<span dir="ltr">' + esc(v[0]) + '</span> = ' + esc(v[1]);
            if(q.rev) say(v[0]);
            setTimeout(next, ok ? 900 : 2200);
          };
        });
      }
      function finish(){
        if(window.saveScore) saveScore(label, right, n, pid, { mode: "memo", unit: id, dur: Math.round((Date.now() - t0) / 1000),
          skills: { "حفظ: مفردات الكتاب": { c: right, t: n } },
          missed: Object.keys(firstTry).filter(function(k){ return !firstTry[k]; }) });
        box.innerHTML = '<div class="st-card"><div class="st-big">'+(right === n ? '🌟' : '👍')+' '+right+' / '+n+'</div>'+
          '<div class="st-hint">'+(right === n ? 'ممتاز! كلّها صح من أوّل مرّة.' : 'الكلمات اللي غلطت فيها بترجع لك بكرة لين تثبت.')+'</div>'+
          '<div class="st-act"><button data-more>جولة ثانية ▶</button><button class="ghost" data-home>رجوع</button></div></div>';
        box.querySelector("[data-more]").onclick = function(){ round(false); };
        box.querySelector("[data-home]").onclick = home;
      }
      next();
    }
    home();
  }

  /* ════════ 🧩 جمل ════════ */
  function sent(box, id, unit){
    var S = sentences(unit), V = vocab(unit);
    var vocTokens = {};
    V.forEach(function(v){ words(v[0]).forEach(function(w){ w = w.replace(/[^A-Za-z']/g, ""); if(w.length > 2) vocTokens[w.toLowerCase()] = w; }); });
    var tokList = Object.keys(vocTokens);
    function home(){
      box.innerHTML = '<div class="intro"><b>🧩 جمل:</b> جملٌ من كتابك. رتّب الكلمات لتكوّن الجملة، وأكمل الفراغ بالكلمة الصحيحة.</div>'+
        '<div class="st-card"><div class="st-hint">جولة من ٨ تمارين (٤ ترتيب + ٤ فراغ)</div>'+
        '<div class="st-act"><button data-go>ابدأ ▶</button></div></div>';
      box.querySelector("[data-go]").onclick = round;
    }
    function round(){
      var order = shuf(S.slice()).slice(0, 4).map(function(s){ return { k: "order", s: s }; });
      var fills = shuf(S.filter(function(s){ return words(s[0]).some(function(w){ return vocTokens[w.replace(/[^A-Za-z']/g, "").toLowerCase()]; }); })).slice(0, 4).map(function(s){ return { k: "fill", s: s }; });
      var list = shuf(order.concat(fills)), i = 0, right = 0, pid = window.newPid ? newPid() : null, t0 = Date.now();
      var SK = { "جمل: ترتيب الكلمات": { c: 0, t: 0 }, "جمل: إكمال الفراغ": { c: 0, t: 0 } };
      var label = "جمل إنجليزي " + id.replace("u", "و") + " 🧩";
      function next(){
        if(i >= list.length) return finish();
        var ex = list[i++]; (ex.k === "order" ? orderEx : fillEx)(ex.s);
      }
      function done(ok, kind){
        var sk = SK[kind === "order" ? "جمل: ترتيب الكلمات" : "جمل: إكمال الفراغ"]; sk.t++; if(ok){ sk.c++; right++; }
      }
      function head(kind){ return '<div class="st-prog">'+(i)+' / '+list.length+'</div><div class="st-card"><div class="st-hint">'+kind+'</div>'; }
      function orderEx(s){
        var target = words(s[0]), pool = shuf(target.map(function(w, k){ return { w: w, k: k }; }));
        /* لا نعرضها مرتّبةً من البداية */
        if(pool.every(function(p, k){ return p.k === k; }) && pool.length > 1) pool.reverse();
        var built = [];
        box.innerHTML = head('🔀 رتّب الكلمات') + '<div class="st-hint" style="margin:4px 0 10px">'+esc(s[1])+'</div>'+
          '<div class="st-chips built" data-built></div><div class="st-chips" data-pool style="margin-top:10px"></div>'+
          '<div class="st-fb"></div><div class="st-act"><button data-chk>تحقّق ✅</button><button class="ghost" data-clr>امسح</button></div></div>';
        var bEl = box.querySelector("[data-built]"), pEl = box.querySelector("[data-pool]"), fb = box.querySelector(".st-fb"), fin = false;
        function draw(){
          bEl.innerHTML = built.map(function(p, k){ return '<button data-b="'+k+'">'+esc(p.w)+'</button>'; }).join("");
          pEl.innerHTML = pool.map(function(p, k){ return built.indexOf(p) < 0 ? '<button data-p="'+k+'">'+esc(p.w)+'</button>' : ''; }).join("");
          bEl.querySelectorAll("[data-b]").forEach(function(b){ b.onclick = function(){ if(fin) return; built.splice(+b.dataset.b, 1); draw(); }; });
          pEl.querySelectorAll("[data-p]").forEach(function(b){ b.onclick = function(){ if(fin) return; built.push(pool[+b.dataset.p]); draw(); }; });
        }
        draw();
        box.querySelector("[data-clr]").onclick = function(){ if(fin) return; built = []; draw(); };
        box.querySelector("[data-chk]").onclick = function(){
          if(fin) return;
          if(built.length < target.length){ fb.style.color = "var(--warn)"; fb.textContent = "رتّب كلّ الكلمات أوّلًا"; return; }
          fin = true;
          var ok = built.map(function(p){ return p.w; }).join(" ") === target.join(" ");
          done(ok, "order");
          fb.style.color = ok ? "var(--good)" : "var(--bad)";
          fb.innerHTML = (ok ? "✅ صح!" : "❌ الصحيح:") + '<div dir="ltr" style="margin-top:4px">' + esc(s[0]) + '</div>';
          say(s[0]);
          var c = box.querySelector("[data-chk]"); c.textContent = "التالي ▶"; c.onclick = next;
          box.querySelector("[data-clr]").style.display = "none";
        };
      }
      function fillEx(s){
        var ws = words(s[0]);
        var cand = []; ws.forEach(function(w, k){ var c = w.replace(/[^A-Za-z']/g, ""); if(vocTokens[c.toLowerCase()]) cand.push(k); });
        var k = cand[Math.floor(Math.random() * cand.length)], raw = ws[k], ans = raw.replace(/[^A-Za-z']/g, "");
        var shown = ws.map(function(w, j){ return j === k ? w.replace(ans, "____") : w; }).join(" ");
        var others = shuf(tokList.filter(function(t){ return t !== ans.toLowerCase(); })).slice(0, 2).map(function(t){ return vocTokens[t]; });
        var opts = shuf(others.concat([ans]));
        box.innerHTML = head('✏️ أكمل الفراغ') + '<div class="st-big en" style="font-size:1.2rem">'+esc(shown)+'</div>'+
          '<div class="st-hint" style="margin-bottom:10px">'+esc(s[1])+'</div><div class="st-opts">'+
          opts.map(function(o, j){ return '<button class="en" data-k="'+j+'">'+esc(o)+'</button>'; }).join("")+
          '</div><div class="st-fb"></div><div class="st-act" style="display:none"><button data-nx>التالي ▶</button></div></div>';
        var fin = false;
        box.querySelectorAll(".st-opts button").forEach(function(b){
          b.onclick = function(){
            if(fin) return; fin = true;
            var ok = opts[+b.dataset.k] === ans; done(ok, "fill");
            box.querySelectorAll(".st-opts button").forEach(function(x){ x.disabled = true; if(opts[+x.dataset.k] === ans) x.classList.add("ok"); });
            if(!ok) b.classList.add("no");
            var fb = box.querySelector(".st-fb"); fb.style.color = ok ? "var(--good)" : "var(--bad)";
            fb.innerHTML = (ok ? "✅ صح!" : "❌") + '<div dir="ltr" style="margin-top:4px">' + esc(s[0]) + '</div>';
            say(s[0]);
            var a = box.querySelector(".st-act"); a.style.display = "flex"; box.querySelector("[data-nx]").onclick = next;
          };
        });
      }
      function finish(){
        var n = list.length;
        if(window.saveScore) saveScore(label, right, n, pid, { mode: "sentences", unit: id, dur: Math.round((Date.now() - t0) / 1000), skills: SK });
        box.innerHTML = '<div class="st-card"><div class="st-big">'+(right === n ? '🌟' : '👍')+' '+right+' / '+n+'</div>'+
          '<div class="st-act"><button data-more>جولة ثانية ▶</button><button class="ghost" data-home>رجوع</button></div></div>';
        box.querySelector("[data-more]").onclick = round;
        box.querySelector("[data-home]").onclick = home;
      }
      next();
    }
    home();
  }

  /* يُركَّب فوق أسئلةِ الوحدة: ينقل ما رسمته render() إلى قسم «أسئلة»
     ويضع أمامه شريطَ الأقسام. ويبقى القسمُ المختار إن أُعيد الرسم. */
  window.STUDY = {
    has: function(id){ return !!(window.BOOK_EN4 && BOOK_EN4[id]); },
    mount: function(sec, id){
      if(!this.has(id)) return;
      injectCss();
      var unit = BOOK_EN4[id];
      var qpane = document.createElement("div");
      while(sec.firstChild) qpane.appendChild(sec.firstChild);
      var bar = document.createElement("div"); bar.className = "st-bar";
      var MODES = [["learn", "📖 احفظ"], ["memo", "🔁 ثبّت"], ["sent", "🧩 جمل"], ["quiz", "📝 أسئلة"]];
      bar.innerHTML = MODES.map(function(m){ return '<button data-m="'+m[0]+'">'+m[1]+'</button>'; }).join("");
      var pane = document.createElement("div");
      sec.appendChild(bar); sec.appendChild(pane); sec.appendChild(qpane);
      function show(m){
        sec._stMode = m;
        bar.querySelectorAll("button").forEach(function(b){ b.classList.toggle("on", b.dataset.m === m); });
        qpane.style.display = m === "quiz" ? "" : "none";
        pane.style.display = m === "quiz" ? "none" : "";
        if(m === "learn") learn(pane, id, unit);
        else if(m === "memo") memo(pane, id, unit);
        else if(m === "sent") sent(pane, id, unit);
        else pane.innerHTML = "";
      }
      bar.querySelectorAll("button").forEach(function(b){ b.onclick = function(){ show(b.dataset.m); }; });
      show(sec._stMode || "learn");
    }
  };
})();
