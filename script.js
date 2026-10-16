// ── Backend API URL ──────────────────────────────────────────
const API = 'http://localhost:3000/api';

// Token save/load karne ke liye
const getToken = () => localStorage.getItem('mindease_token');
const saveToken = (t) => localStorage.setItem('mindease_token', t);

// API call karne ka aasaan helper function
async function api(path, method = 'GET', body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = 'Bearer ' + token;

  const res = await fetch(API + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Something went wrong');
  return data;
}




const A=document.getElementById('app'),OV=document.getElementById('ov');
const ld=(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}};
const sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){toast('Storage is full - delete some items');return false}};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const uid=()=>Math.random().toString(36).slice(2,9);
const fmt=t=>new Date(t).toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'});
let U=ld('dmh_session',null),V='home',page='landing',role='student',snd=null,sndOn=false;
const T=()=>ld('dmh_tickets',[]),D=()=>ld('dmh_diary_'+U.email,[]),G=()=>ld('dmh_img_'+U.email,[]);
const mine=()=>T().filter(t=>t.owner==U.email&&!t.delS).sort((a,b)=>(b.pinS||0)-(a.pinS||0)||b.ts-a.ts);
function toast(m){const e=document.createElement('div');e.className='toast';e.textContent=m;document.body.appendChild(e);setTimeout(()=>e.remove(),2200)}
function modal(h){OV.innerHTML='<div class="card">'+h+'</div>';OV.classList.add('show')}
function closeM(){OV.classList.remove('show');OV.innerHTML=''}
/* ambient sound (generated in-browser, no files) */
function startSound(){
 if(snd){snd.c.resume();snd.m.gain.linearRampToValueAtTime(.35,snd.c.currentTime+2);sndOn=true;return}
 const c=new (window.AudioContext||window.webkitAudioContext)(),m=c.createGain();m.gain.value=0;m.connect(c.destination);
 const n=c.createBuffer(1,c.sampleRate*4,c.sampleRate),d=n.getChannelData(0);let l=0;
 for(let i=0;i<d.length;i++){l=(l+.02*(Math.random()*2-1))/1.02;d[i]=l*3.5}
 const s=c.createBufferSource();s.buffer=n;s.loop=true;
 const f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=420;
 const lg=c.createGain();lg.gain.value=.6;
 const o=c.createOscillator();o.frequency.value=.1;const og=c.createGain();og.gain.value=.25;o.connect(og);og.connect(lg.gain);o.start();
 s.connect(f);f.connect(lg);lg.connect(m);s.start();
 [220,329.6,440].forEach((fr,i)=>{const o=c.createOscillator(),g=c.createGain();o.frequency.value=fr;g.gain.value=.025/(i+1);o.connect(g);g.connect(m);o.start()});
 m.gain.linearRampToValueAtTime(.35,c.currentTime+3);snd={c,m};sndOn=true}
function stopSound(){if(snd){snd.m.gain.linearRampToValueAtTime(0,snd.c.currentTime+.8);sndOn=false}}
/* views */
const LAND=A.innerHTML;
function landing(){return LAND.replace('>Log in<',U?'>Open my space<':'>Log in<').replace('>Get started<',U?'>Continue<':'>Get started<')}
function login(){return `<div class="wrap"><div class="nav"><span class="logo">🌿 MindEase</span><span style="display:flex;gap:.5rem"><button class="sos" data-act="panic">📞 Emergency SOS helpline</button><button class="btn ghost sm" data-act="toLand">Back</button></span></div>
<div class="card auth"><h2>Log in or sign up</h2><p class="mut">New here? Entering a new email creates your account, then you set up your profile. Saved on this device for the demo.</p>
<label>Email<input id="em" type="email" placeholder="you@college.edu" autocomplete="email"></label>
<label>Password<input id="pw" type="password" placeholder="Your password" autocomplete="current-password"></label>
<button class="btn" style="width:100%" data-act="doLogin">Log in</button>
<div class="or">or</div>
<button class="g" data-act="google"><svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.5 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.5 5.8c4.4-4.1 6.8-10 6.8-17.2z"/><path fill="#FBBC05" d="M10.4 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.9-4.7l-7.8-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.8-6.1z"/><path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.6l-7.5-5.8c-2.1 1.4-4.7 2.2-7.7 2.2-6.3 0-11.7-4.3-13.6-10l-7.8 6.1C6.5 42.6 14.6 48 24 48z"/></svg>Continue with Google</button>
<p style="margin:1.1rem 0 .2rem"><b>I am a</b></p>
<div class="pills"><button class="pill ${role=='student'?'on':''}" data-act="role" data-r="student">🎓 Student</button><button class="pill ${role=='counsellor'?'on':''}" data-act="role" data-r="counsellor">🧑‍⚕️ Counsellor</button></div>
<p class="mut" style="margin:0">Logging in as a ${role}. You can also go back and browse without logging in.</p></div></div>`}
function shell(inner){
 const nav=U.role=='student'?[['home','🏠','Home'],['activity','🎫','Support tickets'],['diary','📔','Digital diary'],['dlog','📖','Diary log'],['quiz','📝','Wellness check'],['gallery','🖼️','Image space'],['profile','👤','Profile']]:[['home','🎫','Your tickets'],['profile','👤','Profile']];
 return `<div class="shell"><aside><div class="brand">🌿 MindEase</div>${nav.map(n=>`<button class="nv ${V==n[0]?'on':''}" data-act="go" data-v="${n[0]}">${n[1]} <span>${n[2]}</span></button>`).join('')}<button class="nv" data-act="logout">🚪 <span>Log out</span></button></aside>
 <main><div class="top"><div><h1 style="margin:0">Welcome, ${esc(U.name)}</h1><span class="mut">${U.role=='student'?'Take it one step at a time.':'Counsellor workspace'}</span></div>${U.role=='student'?'<button class="sos" data-act="panic">📞 Emergency SOS helpline</button>':''}</div>${inner}${foot()}</main></div>
 `}
const dots=(t,id)=>`<div class="dots"><button class="ib" data-act="dots" aria-label="More options">⋮</button><div class="menu"><button data-act="pin" data-t="${t}" data-id="${id}">📌 Pin / Unpin</button><button class="dn" data-act="del" data-t="${t}" data-id="${id}">🗑 Delete</button></div></div>`;
function tcard(t,c){return `<div class="card"><div class="row"><div><span class="tag ${t.urgent?'u':''}">${t.urgent?'Urgent':'Normal'}</span><span class="tag">${esc(t.cat)}</span>${t.sub?`<span class="tag">${esc(t.sub)}</span>`:''}<span class="tag">to ${FLD[t.field||'gen']}</span><span class="tag">${LV[t.lvl||1]} level</span><span class="tag ${t.status=='resolved'?'ok':''}">${t.status}</span>${(c?t.pinC:t.pinS)?'📌':''}</div>${dots('tk',t.id)}</div>
<p style="margin:.7rem 0 .3rem">${esc(t.msg)}</p><div class="mut">${c?(t.anon?'Anonymous student #'+t.id.slice(0,4):esc(t.name)+esc(ctx(t))):'You'} - ${fmt(t.ts)}</div>
${t.reply?`<div class="card" style="margin-top:.7rem;background:var(--pri2)"><b>Counsellor reply</b><br>${esc(t.reply)}</div>`:''}
${c&&t.status!='resolved'?`<textarea id="r_${t.id}" style="min-height:70px;margin-top:.8rem" placeholder="Write a reply..."></textarea><button class="btn sm" data-act="reply" data-id="${t.id}">Send reply &amp; resolve</button>`:''}</div>`}
const LIB={Articles:[['Beating exam stress: a simple plan','Sample'],['Writing to cope: how journaling helps','Sample'],['Talking to a counsellor: what to expect','Sample']],Books:[['Ikigai','Purpose & calm'],['Atomic Habits','Small daily steps'],['Wings of Fire','Hope & drive']],Movies:[['Taare Zameen Par','Feeling understood'],['Inside Out','Understanding emotions'],['Dear Zindagi','Talking it out']],Games:[['Sudoku','Focus'],['Breathing bubble','Slow down'],['Jigsaw puzzle','Unwind']]};
const LV=['','Student volunteer','Peer counsellor','Professional counsellor'];
const sev=m=>{m=m.toLowerCase();return /suicid|kill myself|end my life|self.?harm|hurt myself|hopeless|worthless|want to die/.test(m)?3:/depress|panic|anxi|sleep|overwhelm|lonely|alone|nervous|fail|afraid|fear|cry/.test(m)?2:1};
const HELP='<h3>Your ticket has been sent</h3><p>Because this sounds serious, it is marked for a professional counsellor. If you feel unsafe right now, call <b>Tele-MANAS 14416</b> (India, free, 24x7) or go to someone you trust.</p><button class="btn" data-act="cm">OK</button>';
const QS=['Small steps still move you forward.','You do not have to figure everything out today.','Rest is part of the work, not a break from it.','Asking for help is a skill, not a weakness.','One calm breath is a good place to start.'];
function moodCard(){const ds=D().slice(-14),c={};ds.forEach(d=>{if(d.mood)c[d.mood]=(c[d.mood]||0)+1});const k=Object.keys(c),mx=Math.max(1,...k.map(x=>c[x]));
return `<div class="card" style="margin-bottom:1rem"><h3>Mood trend</h3><p class="mut">From your last 14 diary entries. Only you can see this.</p>${k.length?k.map(x=>`<div class="item" style="align-items:center"><span style="width:90px">${x}</span><div style="flex:1;background:var(--pri2);border-radius:6px"><div style="width:${c[x]/mx*100}%;background:var(--pri);height:12px;border-radius:6px"></div></div><b>${c[x]}</b></div>`).join(''):'<p class="mut">Tag your diary entries with a mood to see your trend.</p>'}</div>`}
const MS={Happy:5,Calm:4,Stressed:2,Anxious:2,Sad:1,Angry:1};
function moodChart(){const days=[],now=new Date();for(let i=6;i>=0;i--){const d=new Date(now);d.setDate(now.getDate()-i);days.push(d)}
const ds=D(),vals=days.map(d=>{const e=ds.filter(x=>x.mood&&new Date(x.ts).toDateString()==d.toDateString());return e.length?e.reduce((a,x)=>a+MS[x.mood],0)/e.length:null});
const W=300,H=130,px=i=>34+i*(W-50)/6,py=v=>H-22-(v-1)*(H-44)/4;let path='',dt='';
vals.forEach((v,i)=>{if(v!=null){path+=(path?' L':'M')+px(i)+' '+py(v);dt+=`<circle cx="${px(i)}" cy="${py(v)}" r="4" fill="#1f8a80"/>`}});
return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Weekly mood tracker">${[1,3,5].map(v=>`<line x1="30" x2="${W-10}" y1="${py(v)}" y2="${py(v)}" stroke="var(--bd)"/>`).join('')}<text x="2" y="${py(5)+3}" font-size="9" fill="var(--mut)">High</text><text x="2" y="${py(1)+3}" font-size="9" fill="var(--mut)">Low</text><path d="${path}" fill="none" stroke="#1f8a80" stroke-width="2.5"/>${dt}${days.map((d,i)=>`<text x="${px(i)}" y="${H-5}" font-size="9" text-anchor="middle" fill="var(--mut)">${d.toLocaleDateString(undefined,{weekday:'short'})}</text>`).join('')}</svg>${path?'':'<p class="mut">Tag diary entries with a mood to see your week.</p>'}`}
let CH=[['','Hi! I can share simple coping tips. For anything serious, please raise a ticket.']];
const pick=a=>a[Math.floor(Math.random()*a.length)];
const INT=[
[/quiz|check.?in|screening|am i (anxious|depressed)|phq|gad/,['You can take the Wellness check from the sidebar. It uses two standard questionnaires, PHQ-2 and GAD-7, and takes about two minutes.']],
[/^(hi|hello|hey|namaste|good (morning|evening|afternoon))\b/,['Hello! How are you feeling today?','Hi there. I am here to listen. What is on your mind?','Hey! Take your time, you can tell me anything.']],
[/thank|thanks|shukriya/,['You are welcome. I am glad I could help a little.','Anytime. Be kind to yourself today.']],
[/\b(bye|goodbye|see you)\b/,['Take care. Come back whenever you need to talk.','Bye for now. Remember, a counsellor is always one ticket away.']],
[/exam|test|marks|grade|result|study|backlog|assignment/,['Exam pressure is very common. Try study blocks of 25 minutes with 5 minute breaks.','Marks do not define you. Make a small plan for today and tick off one thing at a time.','If studies feel too heavy, a counsellor can help you plan. You can raise an anonymous ticket.']],
[/sleep|insomnia|awake|tired|exhaust/,['Poor sleep makes everything feel worse. Try no screens for 30 minutes before bed, and slow breathing.','Rest matters. Try the calm sound button at the bottom right while you wind down.']],
[/lonely|alone|no friends|isolated|homesick/,['Feeling lonely is hard, and many students feel it. Reaching out here is a good first step.','Could you message one friend or family member today? Small contact helps. A counsellor can also listen.']],
[/angry|anger|frustrat|irritat|furious/,['Anger often hides stress or hurt. Breathe out slowly for 6 counts, five times.','Step away for a few minutes if you can. Writing it in your diary can take the edge off.']],
[/family|parents|expect/,['Family expectations can feel heavy. Your feelings are valid, and you can talk it through with a counsellor without giving your name.']],
[/friend|breakup|relationship|roommate|fight/,['Relationship stress can affect focus. Writing down what you want to say can help before you talk to them.']],
[/career|job|future|placement|intern/,['Worry about the future is normal. Break it into one small step for this week.']],
[/diary|journal/,['Writing is a great outlet. Open the Digital diary page and add a mood tag to track your week.']],
[/breath|calm|relax/,['Try this: breathe in for 4 counts, hold for 4, out for 6. Repeat five times. The SOS button also has a breathing guide.']],
[/ticket|counsel|therapist|talk to someone/,['You can raise an anonymous ticket from the Support tickets page. A counsellor will reply there.']],
[/who are you|what are you|are you (real|ai|human)/,['I am a simple preview companion with scripted replies, not a real AI or a person. For real support, please use a ticket.']],
[/book|movie|game|bored/,['Try the Relaxation section at the bottom of your home page. Pick Book, Movie or Game and I will suggest one.']],
[/happy|good|great|excited|better|fine/,['That is lovely to hear. What made today feel good?','Glad to hear it. You could note it in your diary to look back on later.'],1],
[/help/,['I can share coping tips, point you to the diary or the relaxation section, or help you raise a ticket. What would you like?']]];
function chatSend(t){const i=document.getElementById('cin'),x=(t||(i&&i.value)||'').trim();if(!x)return;CH.push(['me',x]);const l=sev(x),lw=x.toLowerCase(),neg=/\bnot\b|n't|\bnever\b|\bno\b/.test(lw);let r;
if(l==3)r='I am really sorry you feel this way. Please call Tele-MANAS 14416 now, or raise an urgent ticket so a counsellor can reach you.';
else{const m=INT.find(q=>q[0].test(lw)&&!(q[2]&&neg));r=m?pick(m[1]):l==2?pick(['That sounds heavy. Try slow breathing for a minute, and consider raising a ticket so a counsellor can support you.','I hear you. Would you like to tell me more, or write it in your diary?']):pick(['Thanks for sharing that. You could write about it in your diary, or switch on the calm sound for a few minutes.','I am listening. Tell me a bit more about how it feels.','That makes sense. What would help most right now: a tip, a book or movie, or talking to a counsellor?'])}
CH.push(['',r]);render()}
const foot=()=>`<div class="foot"><div><b>Mapping with SDG Goals (SDG 3 &amp; 10)</b><p>SDG 3 promotes mental health and well-being through early digital support and stress management. SDG 10 gives equal, stigma-free access to support for all students, including rural and underprivileged ones.</p></div><div><b>About the Problem Statement</b><p>SIH2025 problem statement SIH25092: a digital mental health and psychological support system for students in higher education.</p></div></div>`;
const CK=()=>ld('dmh_clock','digital');
function clockCard(){const a=CK()=='analog';return `<div class="card"><div class="row"><h3>Time</h3><button class="btn ghost sm" data-act="clk">${a?'Show digital':'Show analog'}</button></div>${a?`<svg viewBox="0 0 120 120" width="150" height="150" role="img" aria-label="Analog clock" style="display:block;margin:0 auto"><circle cx="60" cy="60" r="56" fill="var(--pri2)" stroke="var(--pri)" stroke-width="3"/>${[...Array(12)].map((_,i)=>`<line x1="60" y1="8" x2="60" y2="${i%3?13:17}" stroke="var(--ink)" stroke-width="${i%3?1.5:2.5}" transform="rotate(${i*30} 60 60)"/>`).join('')}<line id="hh" x1="60" y1="60" x2="60" y2="35" stroke="var(--ink)" stroke-width="4" stroke-linecap="round"/><line id="hm" x1="60" y1="60" x2="60" y2="22" stroke="var(--ink)" stroke-width="2.5" stroke-linecap="round"/><line id="hs" x1="60" y1="66" x2="60" y2="18" stroke="#d93a3a" stroke-width="1.2" stroke-linecap="round"/><circle cx="60" cy="60" r="3" fill="#d93a3a"/></svg>`:'<div class="clock" id="clk"></div>'}<div class="mut" id="dt" style="${a?'text-align:center;margin-top:.5rem':''}"></div></div>`}
const FLD={clin:'Clinical psychologist',rel:'Relationship & marriage counsellor',acad:'Academic & career counsellor',fam:'Family & social counsellor',gen:'General counsellor'};
const CATS={
'Relationships':['rel',['Marriage-related problem','Live-in relationship problem','Dating or breakup','Friendship or roommate issue','Other relationship problem']],
'Academics':['acad',['Exam stress','Low marks or backlogs','Stream or course pressure','Attendance or deadlines','Project or thesis stress']],
'Career':['acad',['Choosing a career path','Placement or job stress','Internship worries','Higher studies decision']],
'Anxiety':['clin',['Panic attacks','Social anxiety','Constant worry','Performance anxiety']],
'Low mood':['clin',['Feeling sad or empty','Loss of interest','Grief or loss','Feeling hopeless']],
'Stress':['clin',['Study or work overload','Burnout','Financial worry','Time management']],
'Sleep':['clin',['Cannot fall asleep','Waking up often','Sleeping too much']],
'Family':['fam',['Parental pressure','Conflict at home','Living away from home','Responsibilities at home']],
'Loneliness':['fam',['No close friends','Homesickness','Feeling left out']],
'Other':['gen',['Something else','Not sure what to choose']]};
const PRF=(e,r)=>ld('dmh_profile_'+r+'_'+e,null),PR=()=>PRF(U.email,U.role);
const subOpts=(c,s)=>CATS[c][1].map(x=>`<option ${x==s?'selected':''}>${x}</option>`).join(''),routeTxt=c=>'This goes only to a '+FLD[CATS[c][0]]+'.';
/* a ticket reaches a counsellor only if the section matches and the counsellor level is high enough; serious (level 3) tickets also reach professional counsellors as a safety net */
const canSee=(t,p)=>!t.delC&&p&&(((p.flds||[]).includes(t.field||'gen')&&p.tier>=(t.lvl||1))||(t.lvl==3&&p.tier==3));
const ctx=t=>{const p=PRF(t.owner,'student');if(!p)return '';const a=[p.age?'age '+p.age:'',p.occ&&p.occ!='Student'?p.stream:[p.stream,p.branch,p.year].filter(Boolean).join(' ')].filter(Boolean);return a.length?' ('+a.join(', ')+')':''};
const sel=(id,a,c)=>`<select id="${id}">${a.map(x=>`<option ${c==x?'selected':''}>${x}</option>`).join('')}</select>`;
const inp=(id,l,v,ph,ty)=>`<label>${l}<input id="${id}" type="${ty||'text'}" value="${esc(v==null?'':v)}" placeholder="${ph||''}"></label>`;
const OCC=['Student','Working professional','Faculty or researcher','Other'];
const STRM={'Student':['B.Tech / B.E.','M.Tech / M.E.','BCA / MCA','B.Sc / M.Sc','B.Com / M.Com','BA / MA','BBA / MBA','Medical (MBBS / BDS / Nursing / Pharmacy)','Law (LLB / LLM)','Diploma / Polytechnic','Other course'],'Working professional':['IT / Software','Teaching / Education','Healthcare','Engineering / Manufacturing','Business / Self-employed','Banking / Finance','Government service','Media / Design / Creative','Other profession'],'Faculty or researcher':['Engineering / Technology','Science','Commerce / Management','Arts / Humanities','Medical / Health sciences','Law','Other discipline'],'Other':['Preparing for competitive exams','Between jobs','Homemaker','Other']};
const ENG=['Computer Science (CSE)','Information Technology','AI and Data Science','Electronics and Communication','Electrical','Mechanical','Civil','Chemical','Other branch'];
const BL=[ENG,ENG,['General computing','Data Science / AI','Cyber Security','Other'],['Physics','Chemistry','Mathematics','Biology','Computer Science','Other'],['General','Accounting and Finance','Taxation','Other'],['English','Hindi','History','Political Science','Psychology','Economics','Sociology','Other'],['Marketing','Finance','HR','Operations','Business Analytics','Other'],['MBBS','BDS','Nursing','Pharmacy','Other'],['Corporate law','Criminal law','Other'],['Computer','Electronics','Mechanical','Civil','Other'],['Other']],YL=[4,2,3,3,3,3,3,5,5,3,4],BRN={},YR={};
STRM.Student.forEach((s,i)=>{BRN[s]=BL[i];YR[s]=YL[i]});
const opts=(a,c)=>a.map(x=>`<option ${c==x?'selected':''}>${x}</option>`).join(''),ord=n=>['1st','2nd','3rd'][n-1]||n+'th',yrOpts=(s,c)=>opts([...Array(YR[s]||4)].map((_,i)=>ord(i+1)+' year'),c);
const num=(id,l,v,max,ph,hide)=>`<label id="w_${id}" ${hide?'hidden':''}>${l}<input id="${id}" type="text" inputmode="numeric" autocomplete="off" data-num="${max}" maxlength="${String(max).length}" value="${v==null?'':v}" placeholder="${ph||''}"></label>`;
const QUAL={1:['Pursuing a degree (any stream)','Pursuing B.A. / B.Sc. Psychology','Pursuing Social Work (BSW / MSW)','Completed volunteer or peer-support training','Other'],2:['Certificate in counselling or peer support','Diploma in counselling','Completed B.A. / B.Sc. Psychology','Pursuing M.A. / M.Sc. Psychology','Trained by the institution counselling cell','Other'],3:['M.A. / M.Sc. Psychology','M.Phil. in Clinical Psychology','Ph.D. in Psychology','MSW (Psychiatric Social Work)','PG Diploma in counselling','MD Psychiatry','Other']};
const EXPL={1:['Just starting','Less than 6 months','6 months to 1 year','1 to 2 years','More than 2 years'],2:['Less than 1 year','1 to 2 years','3 to 5 years','More than 5 years'],3:['Less than 2 years','2 to 5 years','6 to 10 years','11 to 20 years','More than 20 years']};
const CYR=['1st year','2nd year','3rd year','4th year','5th year or above'];
function fillC(){const g=i=>document.getElementById(i),t=+g('pt').value;g('pq').innerHTML=opts(QUAL[t]);g('pe').innerHTML=opts(EXPL[t]);g('w_pyr').hidden=t!=1}
function fillProf(w){const g=i=>document.getElementById(i),o=g('po').value,st=o=='Student';
 if(w=='po')g('ps').innerHTML=opts(STRM[o]);
 const s=g('ps').value;g('pb').innerHTML=opts(BRN[s]||['Not applicable']);g('py').innerHTML=yrOpts(s);
 g('w_pb').hidden=g('w_py').hidden=!st;g('w_px').hidden=!(o=='Working professional'||o=='Faculty or researcher');
 g('l_ps').firstChild.textContent=st?'Stream or course':o=='Other'?'What best describes you':'Profession or field'}
function setup(){const p=PR()||{},st=U.role=='student',o=p.occ||'Student',s0=p.stream&&STRM[o].includes(p.stream)?p.stream:STRM[o][0],isS=o=='Student',ct=p.tier||1;
return `<div class="wrap"><div class="nav"><span class="logo">🌿 MindEase</span><button class="btn ghost sm" data-act="logout">Log out</button></div><div class="card setup"><h2>${p.done?'Edit your profile':'Create your profile'}</h2><p class="mut">${st?'These details help match you with the right counsellor. Share only what you are comfortable with.':'Your sections decide which student tickets reach you. A student ticket goes only to counsellors of the matching section.'}</p>
<div class="fgrid">${inp('pn','Full name',p.name||U.name)}${st?`${num('pa','Age',p.age,70,'e.g. 20')}<label>Gender (optional)${sel('pg',['Prefer not to say','Female','Male','Non-binary','Other'],p.gender)}</label><label>I am a<select id="po">${opts(OCC,o)}</select></label><label id="l_ps">${isS?'Stream or course':o=='Other'?'What best describes you':'Profession or field'}<select id="ps">${opts(STRM[o],s0)}</select></label><label id="w_pb" ${isS?'':'hidden'}>Branch or subject<select id="pb">${opts(BRN[s0]||['Not applicable'],p.branch)}</select></label><label id="w_py" ${isS?'':'hidden'}>Year<select id="py">${yrOpts(s0,p.year)}</select></label>${num('px','Years of experience',p.exp,50,'e.g. 2',!(o=='Working professional'||o=='Faculty or researcher'))}${inp('pi','Institution or workplace',p.inst)}<label>Preferred language${sel('pl',['English','Hindi','Hinglish','Other'],p.lang)}</label>`:`<label>Counsellor type<select id="pt">${LV.slice(1).map((x,i)=>`<option value="${i+1}" ${p.tier==i+1?'selected':''}>${x}</option>`).join('')}</select></label><label>Qualification<select id="pq">${opts(QUAL[ct],p.qual)}</select></label><label id="w_pyr" ${ct==1?'':'hidden'}>Year of study<select id="pyr">${opts(CYR,p.cyear)}</select></label><label>Experience<select id="pe">${opts(EXPL[ct],p.exp)}</select></label>${inp('pl2','Languages',p.lang,'English, Hindi')}`}</div>
${st?'':`<p style="margin:.4rem 0 .3rem"><b>Which section do you belong to?</b></p><p class="mut">Pick every section you handle. This is what links you to student tickets.</p><div class="chk">${Object.keys(FLD).map(k=>`<label><input type="checkbox" class="pf" value="${k}" ${(p.flds||[]).includes(k)?'checked':''}> ${FLD[k]}</label>`).join('')}</div>`}
<p style="margin-top:1.2rem"><button class="btn" data-act="saveP">Save profile</button> ${p.done?'<button class="btn ghost" data-act="go" data-v="profile">Cancel</button>':''}</p></div></div>`}
function pdet(){const p=PR()||{},r=(k,v)=>v?`<div class="item"><span class="mut">${k}</span><b>${esc(v)}</b></div>`:'';
return U.role=='student'?r('Age',p.age)+r('Gender',p.gender)+r('I am a',p.occ)+r('Stream / profession',p.stream)+r('Branch',p.branch)+r('Year',p.year)+r('Experience',p.exp?p.exp+' years':'')+r('Institution',p.inst)+r('Language',p.lang):r('Type',LV[p.tier])+r('Qualification',p.qual)+r('Year of study',p.cyear)+r('Experience',typeof p.exp=='number'?(p.exp?p.exp+' years':''):p.exp)+r('Languages',p.lang)+r('Sections',(p.flds||[]).map(k=>FLD[k]).join(', '))}
const QOPT=['Not at all','Several days','More than half the days','Nearly every day'];
const PHQ=['Little interest or pleasure in doing things','Feeling down, depressed or hopeless'];
const GAD=['Feeling nervous, anxious or on edge','Not being able to stop or control worrying','Worrying too much about different things','Trouble relaxing','Being so restless that it is hard to sit still','Becoming easily annoyed or irritable','Feeling afraid, as if something awful might happen'];
const gadLv=s=>s<5?'Minimal':s<10?'Mild':s<15?'Moderate':'Severe',lv4=s=>s<4?'Low':s<7?'Mild':s<10?'Moderate':'High';
const QZ={
mood:{n:'Mood',t:'PHQ-2',it:PHQ,max:6,hi:s=>s>=3,lv:s=>s>=3?'Positive screen':'Negative screen',cat:['Low mood','Feeling sad or empty']},
anx:{n:'Anxiety',t:'GAD-7',it:GAD,max:21,hi:s=>s>=10,lv:gadLv,cat:['Anxiety','Constant worry']},
str:{n:'Stress and burnout',t:'Short check',it:['Feeling overwhelmed by everything you have to do','Feeling exhausted even after resting','Feeling that you cannot cope with your responsibilities','Feeling tense, with your mind racing about deadlines or tasks'],max:12,hi:s=>s>=7,lv:lv4,cat:['Stress','Burnout']},
slp:{n:'Sleep',t:'Short check',it:['Trouble falling asleep','Waking up during the night or too early','Feeling tired or unrefreshed during the day','Staying on your phone late into the night when you meant to sleep'],max:12,hi:s=>s>=7,lv:lv4,cat:['Sleep','Cannot fall asleep']},
acd:{n:'Academic pressure',t:'Short check',it:['Worrying about exams, marks or results','Finding it hard to concentrate on studies','Feeling pressure from family or others about your marks','Avoiding studying or classes because of stress'],max:12,hi:s=>s>=7,lv:lv4,cat:['Academics','Exam stress']},
rel:{n:'Relationships',t:'Short check',it:['Arguments or tension with a partner, family member, friend or roommate','Finding it hard to talk openly with people close to you','Feeling that people close to you do not understand you','Worrying about a relationship affecting your studies or daily life'],max:12,hi:s=>s>=7,lv:lv4,cat:['Relationships','Other relationship problem']}};
const QH=()=>ld('dmh_quiz_'+U.email,[]).filter(r=>r.q&&QZ[r.q]);let QK=null,QR=null;
const QL=()=>{const m={};QH().sort((a,b)=>a.ts-b.ts).forEach(r=>m[r.q]=r);return m};
const qmsg=(k,s)=>'My wellness check-in ('+QZ[k].t+', '+QZ[k].n.toLowerCase()+'): score '+s+'/'+QZ[k].max+' ('+QZ[k].lv(s).toLowerCase()+'). ';
const qtx=(k,s)=>k=='mood'?(s>=3?'Your answers suggest low mood may be affecting you. This is worth talking about with a counsellor.':'Your answers do not suggest low mood right now.'):k=='anx'?{Minimal:'Few or no anxiety symptoms right now.',Mild:'Mild anxiety symptoms. Breathing, a steady sleep routine and writing in your diary can help.',Moderate:'Moderate anxiety symptoms. Talking to a counsellor is a good idea.',Severe:'Severe anxiety symptoms. We recommend speaking to a counsellor soon.'}[gadLv(s)]:{Low:'Few signs of a problem in this area right now.',Mild:'Some signs. Small routines and the relaxation section can help. Keep an eye on it.',Moderate:'This area is clearly affecting you. Talking to a counsellor can help.',High:'This area is affecting you a lot. We recommend speaking to a counsellor soon.'}[lv4(s)];
const qq=(i,t)=>`<div class="q"><p style="margin:0 0 .5rem">${i+1}. ${t}</p><div class="opts">${QOPT.map((o,v)=>`<label><input type="radio" name="q${i}" value="${v}"><span>${o}</span></label>`).join('')}</div></div>`;
const qbtn=(k,s,t,c)=>`<button class="btn ${c||''}" data-act="newTk" data-cat="${QZ[k].cat[0]}" data-sub="${QZ[k].cat[1]}" data-m="${esc(qmsg(k,s))}">${t}</button>`;
function qprof(c){const L=QL(),ks=Object.keys(L);if(!ks.length)return '';
 const rs=ks.map(k=>({k,s:L[k].score,r:L[k].score/QZ[k].max,hi:QZ[k].hi(L[k].score)})).sort((a,b)=>b.r-a.r),top=rs.find(x=>x.hi);
 return `<div ${c?'':'class="card" style="margin-bottom:1rem"'}><h3>Your problem profile</h3><p>${rs.map(x=>`<span class="tag ${x.hi?'u':'ok'}">${QZ[x.k].n}: ${QZ[x.k].lv(x.s)}</span>`).join('')}</p>${top?`<p class="mut">Main concern: <b>${QZ[top.k].n}</b>. A ${FLD[CATS[QZ[top.k].cat[0]][0]]} can help.</p>${qbtn(top.k,top.s,'Raise a ticket','sm')}`:'<p class="mut">No area stands out as a concern right now. Retake the quizzes any time.</p>'}</div>`}
function qhist(){const h=QH().sort((a,b)=>b.ts-a.ts);return h.length?`<div class="card" style="margin-top:1rem"><h3>Past check-ins</h3>${h.map(r=>{const q=QZ[r.q];return `<div class="item"><span>${fmt(r.ts)} - ${q.n}</span><span class="tag ${q.hi(r.score)?'u':''}">${r.score}/${q.max} ${q.lv(r.score)}</span></div>`}).join('')}</div>`:''}
const qtile=k=>{const q=QZ[k],l=QL()[k];return `<div class="card"><div class="row"><h3>${q.n}</h3><span class="tag">${q.t}</span></div><p class="mut">${q.it.length} questions</p>${l?`<span class="tag ${q.hi(l.score)?'u':'ok'}">Last: ${q.lv(l.score)} (${l.score}/${q.max})</span>`:''}<p><button class="btn sm" data-act="qopen" data-k="${k}">${l?'Retake':'Take quiz'}</button></p></div>`};
function quiz(){
 if(QK&&QR){const q=QZ[QK],s=QR.score;return shell(`<div class="card"><div class="ch t"><h3>${q.n} result</h3><small>${q.t} - ${fmt(QR.ts)}</small></div><div class="clock">${s}<span class="mut"> / ${q.max}</span></div><span class="tag ${q.hi(s)?'u':'ok'}">${q.lv(s)}</span><p class="mut">${qtx(QK,s)}</p><p class="mut">${q.t=='Short check'?'This is our own short check to find the area of your problem, not a clinical test.':'This is a standard screening questionnaire.'} It is not a diagnosis. If you ever feel unsafe, tap Emergency SOS or call Tele-MANAS 14416.</p><p>${q.hi(s)?qbtn(QK,s,'Raise a ticket: '+q.cat[0]):qbtn(QK,s,'Talk to a counsellor anyway','ghost')} <button class="btn ghost" data-act="qhub">All quizzes</button></p></div>${qprof()}`)}
 if(QK){const q=QZ[QK];return shell(`<div class="card"><div class="ch t"><h3>${q.n}</h3><small>${q.t}</small></div><p class="mut">Over the last 2 weeks, how often have you been bothered by the following? Your answers stay private unless you share the result in a ticket.</p>${q.it.map((t,i)=>qq(i,t)).join('')}<p style="margin-top:1rem"><button class="btn" data-act="qdo">See my result</button> <button class="btn ghost" data-act="qhub">Back</button></p></div>`)}
 return shell(`<div class="card"><div class="ch t"><h3>Wellness check</h3><small>Short quizzes to understand what you are facing</small></div><p class="mut">Mood (PHQ-2) and anxiety (GAD-7) are standard screening questionnaires. The others are our own short questions that help find the area of your problem. None of them is a diagnosis. Results stay private unless you share them in a ticket.</p>${qprof()}<div class="grid">${Object.keys(QZ).map(qtile).join('')}</div></div>${qhist()}`)}
let tf='all',lastRec='';
const REC={Book:[['Ikigai','A gentle read on finding purpose and slowing down.',['Stressed','Sad','Calm']],['Atomic Habits','Tiny daily steps that make big problems feel smaller.',['Stressed','Anxious']],['Wings of Fire','The story of Dr APJ Abdul Kalam: hope and persistence.',['Sad','Happy']],['The Alchemist','A calm, hopeful story about following your path.',['Sad','Calm','Happy']],['The Power of Now','A guide to settling racing thoughts by staying in the present.',['Anxious','Angry']]],
Movie:[['Inside Out','Shows why every emotion, even sadness, has a place.',['Sad','Anxious','Angry']],['Taare Zameen Par','A warm film about being understood and supported.',['Sad','Stressed']],['Dear Zindagi','About talking things through with someone you trust.',['Anxious','Sad','Stressed']],['3 Idiots','Light, funny and about pressure in college life.',['Stressed','Happy']],['Zindagi Na Milegi Dobara','A road trip that reminds you life is bigger than one worry.',['Happy','Calm','Stressed']]],
Game:[['Sudoku','Quiet focus that crowds out racing thoughts.',['Anxious','Stressed']],['Breathing bubble','A one-minute guided breathing exercise.',['Anxious','Angry','Stressed']],['Jigsaw puzzle','Slow, absorbing and satisfying.',['Calm','Stressed','Sad']],['Mandala colouring','Colour at your own pace, with no score and no pressure.',['Calm','Anxious','Sad']],['Chess puzzles','Channel restless energy into a small challenge.',['Angry','Happy']]]};
function recommend(k){const mood=(D().filter(d=>d.mood).sort((a,b)=>b.ts-a.ts)[0]||{}).mood,all=REC[k];let pool=mood?all.filter(r=>r[2].includes(mood)):all;if(!pool.length)pool=all;const alt=pool.filter(r=>r[0]!=lastRec),src=alt.length?alt:pool,r=src[Math.floor(Math.random()*src.length)];lastRec=r[0];
modal(`<h3>${k=='Book'?'📚':k=='Movie'?'🎬':'🎮'} Try: ${esc(r[0])}</h3><p>${r[1]}</p><p class="mut">${mood?'Picked because your latest diary mood was '+mood+'.':'A pick to help you unwind. Tag a diary mood to get more personal picks.'}</p>${r[0]=='Breathing bubble'?'<div class="breath">Breathe</div>':''}<p><button class="btn" data-act="rec" data-k="${k}">Another ${k.toLowerCase()}</button> <button class="btn ghost" data-act="cm">Close</button></p>`)}
let lib='Books';
function home(){
 if(U.role=='counsellor'){const p=PR(),ts=T().filter(t=>canSee(t,p)).sort((a,b)=>(b.pinC||0)-(a.pinC||0)||b.ts-a.ts);
  return shell(`<h2>Your tickets (${ts.filter(t=>t.status=='open').length} open)</h2><p class="mut">Open by level: ${[3,2,1].map(l=>LV[l]+' '+ts.filter(t=>t.status=='open'&&(t.lvl||1)==l).length).join(' | ')}</p><p class="mut">Your sections: ${(p.flds||[]).map(k=>'<span class="tag">'+FLD[k]+'</span>').join('')} ${LV[p.tier]} level</p>${ts.length?`<div class="grid">${ts.map(t=>tcard(t,1)).join('')}</div>`:`<div class="card"><p>No tickets for your sections yet. Student tickets appear here only when they match your sections and level.</p><button class="btn sm" data-act="seed">Load demo tickets</button></div>`}`)}
 const ts=mine(),dy=D().sort((a,b)=>b.ts-a.ts)[0];
 return shell(`<div class="dashboard-layout">
 <div class="card dashboard-support"><div class="ch o" data-act="go" data-v="activity"><h3>Support tickets</h3><small>Anonymous counselling - open the full page</small></div><button class="btn" data-act="newTk">+ New ticket</button>
 <div style="margin:.8rem 0">${ts.slice(0,3).map(t=>`<div class="item"><span>${esc(t.cat)}${t.sub?' - '+esc(t.sub):''} <span class="mut">${fmt(t.ts)}</span></span><span class="tag ${t.status=='resolved'?'ok':''}">${t.status}</span></div>`).join('')||'<p class="mut">No tickets yet. Tell the counselling cell what is on your mind.</p>'}</div>${ts.some(t=>t.reply)?'<p class="mut">💬 A counsellor has replied</p>':''}<button class="btn ghost sm" data-act="go" data-v="activity">All activity</button></div>
 <div class="card dashboard-check"><div class="ch t" data-act="go" data-v="quiz"><h3>Wellness check</h3><small>Quizzes to find what you are facing - open the full page</small></div>${qprof(1)}<p class="mut">Take a short quiz:</p><p>${Object.keys(QZ).map(k=>`<button class="btn ghost sm" data-act="qopen" data-k="${k}">${QZ[k].n}</button>`).join(' ')}</p></div>
 <div class="card dashboard-diary"><div class="ch t" data-act="go" data-v="diary"><h3>Digital diary</h3><small>Weekly mood tracker - open the full page</small></div>${moodChart()}${dy?`<p class="mut" style="margin:.5rem 0">Last entry: <b>${esc(dy.title||'Untitled')}</b>, ${fmt(dy.ts)}</p>`:''}<button class="btn sm" data-act="go" data-v="diary">Write in diary</button> <button class="btn ghost sm" data-act="go" data-v="dlog">Diary log</button></div>
 <div class="card dashboard-chat"><div class="ch p"><h3>Chat companion</h3><small>Preview with scripted replies, not real AI</small></div><div class="chat" id="chat">${CH.map(m=>`<div class="msg ${m[0]}">${esc(m[1])}</div>`).join('')}</div><div class="chips">${['Hello','I feel stressed','I cannot sleep','Exam fear','I feel lonely'].map(c=>`<button data-act="chip" data-t="${c}">${c}</button>`).join('')}</div><div style="display:flex;gap:.4rem"><input id="cin" placeholder="Type a message..." style="margin:0"><button class="btn" data-act="chat">Send</button></div></div>
 <div class="dashboard-utilities"><div class="dashboard-thought"><h3>Today's thought</h3><p>${QS[new Date().getDate()%QS.length]}</p></div>${clockCard()}</div>
 <div class="dashboard-privacy"><h3>🔒 Your privacy</h3><p class="mut" style="margin:0">Every ticket can be anonymous, and your diary is visible only to you. No stigma, no judgement.</p></div>
 <div class="dashboard-relax relax"><div class="ch p"><h3>Relaxation section</h3><small>Choose a section and get a recommendation</small></div><p class="mut">What would you like right now?</p><div class="rtiles">${[['Book','📚','Read something that settles the mind'],['Movie','🎬','Watch something that lifts your mood'],['Game','🎮','Play something that eases your thoughts']].map(r=>`<button class="rt" data-act="rec" data-k="${r[0]}"><span style="font-size:3rem">${r[1]}</span><b>${r[0]}</b><span class="mut">${r[2]}</span></button>`).join('')}</div><p style="margin-top:1rem"><button class="btn ghost sm" data-act="go" data-v="gallery">Open my image space</button></p></div></div>`)}
function activity(){const all=mine(),ts=all.filter(t=>tf=='all'||t.status==tf);
return shell(`<div class="card"><div class="ch o"><h3>Support tickets</h3><small>Your conversations with the counselling cell</small></div><div class="row" style="margin-bottom:1rem"><div class="tabs" style="margin:0">${[['all','All'],['open','Open'],['resolved','Resolved']].map(f=>`<button class="tab ${tf==f[0]?'on':''}" data-act="tf" data-f="${f[0]}">${f[1]} (${f[0]=='all'?all.length:all.filter(t=>t.status==f[0]).length})</button>`).join('')}</div><button class="btn sm" data-act="newTk">+ New ticket</button></div>${ts.length?`<div class="grid">${ts.map(t=>tcard(t,0)).join('')}</div>`:'<p class="mut">Nothing here yet. Use New ticket to reach a counsellor.</p>'}</div>`)}
function diary(){return shell(`<div class="card"><div class="ch t"><h3>Digital diary</h3><small>Write today's entry</small></div><div style="margin-bottom:1rem">${moodChart()}</div><p class="mut">Private to you. Counsellors cannot see your diary.</p><input id="dt1" placeholder="Title (optional)"><select id="dm"><option value="">No mood tag</option><option>Calm</option><option>Happy</option><option>Anxious</option><option>Sad</option><option>Angry</option><option>Stressed</option></select><textarea id="dx" placeholder="Write however you like. Only you can see this."></textarea><button class="btn" data-act="saveD">Save entry</button> <button class="btn ghost" data-act="go" data-v="dlog">Open diary log (${D().length})</button></div>`)}
function dlog(){const ds=D().sort((a,b)=>(b.pin||0)-(a.pin||0)||b.ts-a.ts);
return shell(`<div class="card"><div class="ch t"><h3>Diary log</h3><small>All your saved entries, visible only to you</small></div><div class="row" style="margin-bottom:1rem"><span class="mut">${ds.length} ${ds.length==1?'entry':'entries'}</span><button class="btn sm" data-act="go" data-v="diary">+ Write new entry</button></div><div class="list">${ds.map(d=>`<div class="card"><div class="row"><div><b>${esc(d.title||'Untitled')}</b> ${d.mood?'<span class="tag">'+d.mood+'</span>':''}${d.pin?'📌':''}<div class="mut">${fmt(d.ts)}</div></div>${dots('dy',d.id)}</div><p style="white-space:pre-wrap">${esc(d.text)}</p></div>`).join('')||'<p class="mut">No entries yet. Write your first one on the Digital diary page.</p>'}</div></div>`)}
function gallery(){const g=G().sort((a,b)=>(b.pin||0)-(a.pin||0)||b.ts-a.ts);
 return shell(`<div class="row"><h2>Image space</h2><label class="btn sm">+ Add image<input type="file" id="fi" accept="image/*" hidden></label></div><p class="mut">Add photos, drawings or anything that makes you feel calm. Saved only on this device.</p>
 <div class="imgs">${g.map(i=>`<div class="card"><div class="row" style="margin-bottom:.3rem"><span>${i.pin?'📌':''}</span>${dots('im',i.id)}</div><img src="${i.src}" alt="Saved image"></div>`).join('')||'<div class="card mut">No images yet.</div>'}</div>`)}
function profile(){const ts=U.role=='student'?mine():T().filter(t=>canSee(t,PR())),st=U.role=='student'?[['Tickets',ts.length],['Open',ts.filter(t=>t.status=='open').length],['Resolved',ts.filter(t=>t.status=='resolved').length],['Diary entries',D().length],['Images',G().length],['Check-ins',QH().length]]:[['Total tickets',ts.filter(t=>!t.delC).length],['Open',ts.filter(t=>!t.delC&&t.status=='open').length],['Resolved',ts.filter(t=>!t.delC&&t.status=='resolved').length],['Urgent open',ts.filter(t=>!t.delC&&t.urgent&&t.status=='open').length]];
 return shell(`<div class="card" style="margin-bottom:1rem"><h3>Dashboard</h3><div class="stats">${st.map(s=>`<div class="card stat"><b>${s[1]}</b><span class="mut">${s[0]}</span></div>`).join('')}</div></div>
 ${U.role=='student'?moodCard():''}<div class="card"><div class="row"><h3>Profile</h3><button class="btn sm" data-act="go" data-v="setup">Edit profile</button></div><p class="mut">${esc(U.email)} - ${U.role}</p>${pdet()}<p style="margin-top:1rem"><button class="btn ghost sm" data-act="wipe">Clear all demo data</button></p></div>`)}
const sndBtn=()=>`<button class="sndb" data-act="snd">${sndOn?'🔊 Calm sound on':'🎧 Calm sound'}</button>`;
function render(){
 if(page=='app'&&U&&!PR())V='setup';
 const h=page=='landing'?landing():page=='login'?login():({home,activity,diary,dlog,quiz,gallery,profile,setup}[V]||home)();
 A.innerHTML=h+sndBtn();tick();const c=document.getElementById('chat');if(c)c.scrollTop=c.scrollHeight}
function tick(){const n=new Date(),c=document.getElementById('clk');if(c)c.textContent=n.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
const dt=document.getElementById('dt');if(dt)dt.textContent=n.toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'long'});
const h=document.getElementById('hh');if(h){const sc=n.getSeconds(),m=n.getMinutes()+sc/60,hr=n.getHours()%12+m/60;h.setAttribute('transform','rotate('+hr*30+' 60 60)');document.getElementById('hm').setAttribute('transform','rotate('+m*6+' 60 60)');document.getElementById('hs').setAttribute('transform','rotate('+sc*6+' 60 60)')}}
setInterval(tick,1000);

// ── Backend se Login / Register ──────────────────────────────
async function enterWithBackend(email, password, role) {
  try {
    // login ke liye
    let data;
    try {
      data = await api('/auth/login', 'POST', { email, password });
    } catch (e) {
      // Login fail hua matlab new user hai — register karo
      data = await api('/auth/register', 'POST', { email, password, role });
    }

    // Token aur user info save karo
    saveToken(data.token);
    U = {
      email: data.user.email,
      name: data.user.name,
      role: data.user.role,
      id: data.user.id
    };
    sv('dmh_session', U);
    page = 'app';
    V = 'home';
    startSound();
    render();

  } catch (err) {
    toast('Error: ' + err.message);
  }
}

function enter(email,name,r){const p=PRF(email,r);U={email,name:(p&&p.name)||name,role:r};sv('dmh_session',U);page='app';V=p?'home':'setup';startSound();render()}
/* actions */
document.addEventListener('click',e=>{
 if(!e.target.closest('.dots'))document.querySelectorAll('.menu.show').forEach(m=>m.classList.remove('show'));
 if(e.target==OV){closeM();return}
 const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act,d=b.dataset;
 if(a=='toLogin'){if(U){page='app';V='home';startSound()}else page='login';render()}
 else if(a=='toCouns'){role='counsellor';if(U&&U.role=='counsellor'){page='app';V='home';startSound()}else page='login';render()}
 else if(a=='toLand'){page='landing';render()}
 else if(a=='role'){role=d.r;render()}
 
else if(a=='doLogin'){
  const em = document.getElementById('em').value.trim();
  const pw = document.getElementById('pw').value;
  if(!/^\S+@\S+\.\S+$/.test(em)) return toast('Enter a valid email');
  if(pw.length < 4) return toast('Password needs 4+ characters');
  enterWithBackend(em, pw, role);  // ← ab backend se login hoga
}


 else if(a=='google')modal(`<h3>Choose a Google account</h3><p class="mut">Demo sign-in: type your Gmail address.</p><input id="gm" type="email" placeholder="yourname@gmail.com"><button class="btn" data-act="gdo">Continue as ${role}</button> <button class="btn ghost" data-act="cm">Cancel</button>`)
 else if(a=='gdo'){const g=document.getElementById('gm').value.trim();if(!/^\S+@\S+\.\S+$/.test(g))return toast('Enter a valid Gmail address');closeM();enter(g,g.split('@')[0],role)}
 else if(a=='cm')closeM();
 else if(a=='logout'){stopSound();U=null;try{localStorage.removeItem('dmh_session')}catch(x){}page='landing';render()}
 else if(a=='go'){V=d.v;if(V=='quiz'){QK=null;QR=null}render()}
 else if(a=='snd'){sndOn?stopSound():startSound();document.querySelectorAll('.sndb').forEach(x=>x.textContent=sndOn?'🔊 Calm sound on':'🎧 Calm sound')}
 else if(a=='dots'){const m=b.nextElementSibling,s=m.classList.contains('show');document.querySelectorAll('.menu.show').forEach(x=>x.classList.remove('show'));if(!s)m.classList.add('show')}
 else if(a=='lib'){lib=d.k;render()}
 else if(a=='chat')chatSend()
 else if(a=='chip')chatSend(d.t)
 else if(a=='clk'){sv('dmh_clock',CK()=='analog'?'digital':'analog');render()}
 else if(a=='rec')recommend(d.k)
 else if(a=='tf'){tf=d.f;render()}
 else if(a=='newTk'){const c0=CATS[d.cat]?d.cat:Object.keys(CATS)[0];modal(`<h3>Create a ticket</h3><label>What is it about?<select id="tc">${Object.keys(CATS).map(c=>`<option ${c==c0?'selected':''}>${c}</option>`).join('')}</select></label><label>Which best describes it?<select id="tsub">${subOpts(c0,d.sub)}</select></label><p class="mut" id="rtx">${routeTxt(c0)}</p><label>Message<textarea id="tm" placeholder="Share as much or as little as you want...">${esc(d.m||'')}</textarea></label>${d.m?'<p class="mut">Your check-in result is added above. You can edit or delete it before sending.</p>':''}<label><input type="checkbox" id="ta" style="width:auto;margin:0 .4rem 0 0"> Keep my name hidden from the counsellor</label><label><input type="checkbox" id="tu" style="width:auto;margin:.6rem .4rem 0 0"> This is urgent</label><p><button class="btn" data-act="subTk">Submit ticket</button> <button class="btn ghost" data-act="cm">Cancel</button></p>`)}
 
 else if(a=='subTk'){
  const m = document.getElementById('tm').value.trim();
  if(!m) return toast('Please write a message');
  const cat = document.getElementById('tc').value;
  const sb  = document.getElementById('tsub').value;
  const u   = document.getElementById('tu').checked;
  const anon = document.getElementById('ta').checked;

  // Backend mein ticket bhejo
  api('/tickets', 'POST', {
    category: cat,
    sub_category: sb,
    field: CATS[cat][0],
    message: m,
    anon: anon,
    urgent: u
  }).then(data => {
    closeM();
    toast('Ticket sent ✅');
    if(data.escalated) modal(HELP);
    render();
  }).catch(err => toast('Error: ' + err.message));
}
 
 
 else if(a=='saveD'){
  const content = document.getElementById('dx').value.trim();
  if(!content) return toast('Write something first');

  api('/diary', 'POST', {
    title: document.getElementById('dt1').value.trim(),
    mood:  document.getElementById('dm').value,
    content: content
  }).then(() => {
    toast('Entry saved ✅');
    render();
  }).catch(err => toast('Error: ' + err.message));
}
 else if(a=='pin'||a=='del'){
  if(d.t=='tk'){const t=T(),x=t.find(i=>i.id==d.id),c=U.role=='counsellor';if(a=='pin')x[c?'pinC':'pinS']=x[c?'pinC':'pinS']?0:1;else x[c?'delC':'delS']=1;sv('dmh_tickets',t)}
  else{const k=d.t=='dy'?'dmh_diary_':'dmh_img_',l=ld(k+U.email,[]);if(a=='pin'){const x=l.find(i=>i.id==d.id);x.pin=x.pin?0:1;sv(k+U.email,l)}else sv(k+U.email,l.filter(i=>i.id!=d.id))}
  render()}
 else if(a=='reply'){const r=document.getElementById('r_'+d.id).value.trim();if(!r)return toast('Write a reply first');const t=T(),x=t.find(i=>i.id==d.id);x.reply=r;x.status='resolved';sv('dmh_tickets',t);render()}
 else if(a=='seed'){const t=T(),m=[['Academics','Exam stress','I cannot sleep before the semester exams and feel overwhelmed.',2,0,'B.Tech',20],['Anxiety','Panic attacks','I get nervous speaking in class and avoid going.',2,1,'BBA',19],['Relationships','Live-in relationship problem','My partner and I live together and we fight about money and space.',1,0,'MBA',24],['Relationships','Marriage-related problem','I am married and my in-laws keep interfering. It is affecting my studies.',2,0,'M.Sc',26],['Family','Parental pressure','My parents expect a government job and I want something else.',1,0,'B.Com',21]];
  m.forEach((x,i)=>{const e='demo'+i+'@x.com',n='Student '+'ABCDE'[i];t.push({id:uid(),owner:e,name:n,cat:x[0],sub:x[1],field:CATS[x[0]][0],msg:x[2],urgent:false,lvl:x[3],anon:!!x[4],status:'open',ts:Date.now()-i*3600e3});sv('dmh_profile_student_'+e,{role:'student',done:1,name:n,age:x[6],occ:'Student',stream:x[5]})});sv('dmh_tickets',t);render()}
 else if(a=='saveP'){const v=i=>{const x=document.getElementById(i);return x?x.value.trim():''},nm=v('pn');if(!nm)return toast('Please enter your name');let p={role:U.role,done:1,name:nm};
  if(U.role=='student'){const age=+v('pa'),oc=v('po'),isS=oc=='Student',pro=oc=='Working professional'||oc=='Faculty or researcher';if(!(age>=14&&age<=70))return toast('Enter a valid age (14 to 70)');if(pro&&v('px')==='')return toast('Enter your years of experience (0 to 50)');p={...p,age,gender:v('pg'),occ:oc,stream:v('ps'),branch:isS?v('pb'):'',year:isS?v('py'):'',exp:pro?+v('px'):0,inst:v('pi'),lang:v('pl')}}
  else{const f=[...document.querySelectorAll('.pf:checked')].map(x=>x.value);if(!f.length)return toast('Select at least one section');p={...p,tier:+v('pt'),flds:f,qual:v('pq'),exp:v('pe'),cyear:+v('pt')==1?v('pyr'):'',lang:v('pl2')}}
  sv('dmh_profile_'+U.role+'_'+U.email,p);U.name=nm;sv('dmh_session',U);V='home';toast('Profile saved');render()}
 else if(a=='qopen'){V='quiz';QK=d.k;QR=null;render()}
 else if(a=='qhub'){QK=null;QR=null;render()}
 else if(a=='qdo'){const n=QZ[QK].it.length;let sc=0;for(let i=0;i<n;i++){const x=document.querySelector('input[name=q'+i+']:checked');if(!x)return toast('Please answer all '+n+' questions');sc+=+x.value}
  const r={id:uid(),ts:Date.now(),q:QK,score:sc},h=ld('dmh_quiz_'+U.email,[]);h.push(r);sv('dmh_quiz_'+U.email,h);QR=r;render()}
 else if(a=='saveN'){U.name=document.getElementById('nm').value.trim()||U.name;sv('dmh_session',U);toast('Name saved');render()}
 else if(a=='wipe'){if(confirm('Delete all demo data stored on this device?')){try{Object.keys(localStorage).filter(k=>k.startsWith('dmh_')&&k!='dmh_session').forEach(k=>localStorage.removeItem(k))}catch(x){}render()}}
 else if(a=='panic')modal(`<h3>Emergency support</h3><p class="mut">You are not alone. Reach out right now:</p><p><a class="btn" href="tel:14416" style="display:inline-block;text-decoration:none">📞 Call Tele-MANAS 14416</a> <a class="btn ghost" href="tel:112" style="display:inline-block;text-decoration:none">Call 112</a></p><div class="breath">Breathe</div><p class="mut" style="text-align:center">In through your nose... and slowly out.</p>${U&&U.role=='student'?'<button class="btn" data-act="urgent">Alert my counsellor</button> ':''}<button class="btn ghost" data-act="cm">I am okay now</button>`)
 else if(a=='urgent'){const t=T();t.push({id:uid(),owner:U.email,name:U.name,cat:'Panic button',sub:'Emergency alert',field:'clin',msg:'Student pressed the panic button and needs urgent support.',anon:false,urgent:true,lvl:3,status:'open',ts:Date.now()});sv('dmh_tickets',t);closeM();toast('Your counsellor has been alerted');render()}
});
document.addEventListener('input',e=>{const t=e.target;if(t.dataset&&t.dataset.num){let v=t.value.replace(/\D/g,'');if(+v>+t.dataset.num)v=t.dataset.num;if(v!==t.value)t.value=v}});
document.addEventListener('change',e=>{if(e.target.id=='po'||e.target.id=='ps')fillProf(e.target.id);if(e.target.id=='pt')fillC();if(e.target.id=='tc'){document.getElementById('tsub').innerHTML=subOpts(e.target.value);document.getElementById('rtx').textContent=routeTxt(e.target.value)}if(e.target.id=='fi'&&e.target.files[0]){const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const s=Math.min(1,640/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=im.width*s;c.height=im.height*s;c.getContext('2d').drawImage(im,0,0,c.width,c.height);const g=G();g.push({id:uid(),src:c.toDataURL('image/jpeg',.7),ts:Date.now()});sv('dmh_img_'+U.email,g);render()};im.src=r.result};r.readAsDataURL(e.target.files[0])}});
document.addEventListener('keydown',e=>{if(e.key=='Enter'&&e.target.id=='cin')chatSend()});
render();
