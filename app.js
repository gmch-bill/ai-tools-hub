// Public website logic
document.write('<script src="config.js"><\/script>');
setTimeout(async () => {
  const url = window.SUPABASE_URL, key = window.SUPABASE_ANON_KEY;
  if (!url || !key || url.includes("YOUR-PROJECT")) return showDemo();

  const { createClient } = supabase;
  const db = createClient(url, key);

  const { data: tools, error } = await db.from("tools").select("*").eq("published", true).order("featured", {ascending:false}).order("created_at",{ascending:false});
  const { data: ads } = await db.from("ads").select("*").eq("enabled", true);

  renderTools(tools || []);
  renderCategories(tools || []);
  renderAds(ads || []);
}, 0);

function showDemo(){
  const demo=[
    {name:"AI Image Creator",category:"Image",description:"Create and edit images with AI.",image_url:"",button_text:"Check Tool →",destination_url:"#"},
    {name:"AI Video Creator",category:"Video",description:"Create videos from ideas, images or text.",image_url:"",button_text:"Check Tool →",destination_url:"#"},
    {name:"AI Writing Assistant",category:"Writing",description:"Generate ideas and improve your writing with AI.",image_url:"",button_text:"Check Tool →",destination_url:"#"}
  ];
  renderTools(demo); renderCategories(demo);
}
function esc(s=""){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function renderTools(tools){
  const grid=document.getElementById("tool-grid");
  grid.innerHTML=tools.length?tools.map(t=>`<article class="tool">${t.image_url?`<img src="${esc(t.image_url)}" alt="${esc(t.name)}">`:""}<small>${esc(t.category||"AI Tool")}</small><h3>${esc(t.name)}</h3><p>${esc(t.description||"")}</p><a class="btn primary" href="${esc(t.destination_url||"#")}" target="_blank" rel="nofollow sponsored noopener">${esc(t.button_text||"Check Tool →")}</a></article>`).join(""):`<div class="empty">No tools found.</div>`;
  document.getElementById("search").oninput=e=>{const q=e.target.value.toLowerCase();document.querySelectorAll(".tool").forEach(x=>x.style.display=x.innerText.toLowerCase().includes(q)?"":"none")};
}
function renderCategories(tools){
  const icons={Image:"🎨",Video:"🎬",Writing:"✍️",Voice:"🎙️",Productivity:"⚡",Other:"🤖"};
  const cats=[...new Set(tools.map(t=>t.category).filter(Boolean))];
  document.getElementById("category-grid").innerHTML=(cats.length?cats:["Image","Video","Writing","Voice"]).map(c=>`<div class="category"><div class="icon">${icons[c]||"🤖"}</div><h3>AI ${esc(c)} Tools</h3><p>Explore useful tools for ${esc(c.toLowerCase())} tasks.</p><a class="btn" href="#tools" onclick="filterCategory('${esc(c)}')">Explore →</a></div>`).join("");
}
window.filterCategory=function(c){document.getElementById("search").value=c;document.getElementById("search").dispatchEvent(new Event("input"));document.getElementById("tools").scrollIntoView({behavior:"smooth"});}
function renderAds(ads){
  const slots={top:document.getElementById("ad-top"),middle:document.getElementById("ad-middle"),bottom:document.getElementById("ad-bottom")};
  ads.forEach(a=>{
    const wrap=document.createElement("div");wrap.className="ad-wrap";
    // Admin-authored ad code is rendered only from the database. Do not allow public users to edit ads.
    wrap.innerHTML=a.ad_code||"";
    (slots[a.placement]||slots.middle).appendChild(wrap);
  });
}
