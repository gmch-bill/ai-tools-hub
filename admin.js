const db=supabase.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY);
const $=id=>document.getElementById(id);
let editingTool=null, editingAd=null;

(async()=>{
 const {data:{session}}=await db.auth.getSession();
 if(session) showDashboard(); else $("login-card").classList.remove("hidden");
 db.auth.onAuthStateChange((_e,s)=>{if(s)showDashboard();});
})();
$("login").onclick=async()=>{const {error}=await db.auth.signInWithPassword({email:$("email").value,password:$("password").value});$("login-msg").textContent=error?error.message:"Logged in";if(!error)showDashboard();};
$("logout").onclick=async()=>{await db.auth.signOut();location.reload();};

function showDashboard(){$("login-card").classList.add("hidden");$("dashboard").classList.remove("hidden");$("logout").classList.remove("hidden");loadTools();loadAds();}
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));b.classList.add("active");document.querySelectorAll(".tab-panel").forEach(x=>x.classList.add("hidden"));$(b.dataset.tab+"-tab").classList.remove("hidden");});

$("save-tool").onclick=async()=>{
 const row={name:$("tool-name").value.trim(),category:$("tool-category").value,description:$("tool-description").value.trim(),image_url:$("tool-image").value.trim(),destination_url:$("tool-url").value.trim(),button_text:$("tool-button").value.trim()||"Check Tool →",featured:$("tool-featured").checked,published:$("tool-published").checked};
 let r=editingTool?await db.from("tools").update(row).eq("id",editingTool):await db.from("tools").insert(row);
 if(r.error)return alert(r.error.message);clearTool();loadTools();
};
$("clear-tool").onclick=clearTool;
function clearTool(){editingTool=null;["tool-id","tool-name","tool-description","tool-image","tool-url"].forEach(id=>$(id).value="");$("tool-button").value="Check Tool →";$("tool-featured").checked=false;$("tool-published").checked=true;}

async function loadTools(){const {data,error}=await db.from("tools").select("*").order("created_at",{ascending:false});if(error)return alert(error.message);$("tools-list").innerHTML=(data||[]).map(t=>`<div class="item"><div><strong>${esc(t.name)}</strong><br><span class="badge">${esc(t.category)}</span> ${t.published?"":"<span class='badge'>Draft</span>"}</div><div><button onclick='editTool(${JSON.stringify(t).replace(/'/g,"&#39;")})'>Edit</button><button class="danger" onclick="deleteTool('${t.id}')">Delete</button></div></div>`).join("")||"<p>No tools yet.</p>";}
window.editTool=t=>{editingTool=t.id;$("tool-name").value=t.name||"";$("tool-category").value=t.category||"Other";$("tool-description").value=t.description||"";$("tool-image").value=t.image_url||"";$("tool-url").value=t.destination_url||"";$("tool-button").value=t.button_text||"Check Tool →";$("tool-featured").checked=!!t.featured;$("tool-published").checked=!!t.published;scrollTo(0,0);}
window.deleteTool=async id=>{if(confirm("Delete this tool?")){const {error}=await db.from("tools").delete().eq("id",id);if(error)alert(error.message);else loadTools();}};

$("save-ad").onclick=async()=>{
 const row={name:$("ad-name").value.trim(),ad_type:$("ad-type").value,placement:$("ad-placement").value,ad_code:$("ad-code").value,show_mobile:$("ad-mobile").checked,show_desktop:$("ad-desktop").checked,enabled:$("ad-enabled").checked};
 let r=editingAd?await db.from("ads").update(row).eq("id",editingAd):await db.from("ads").insert(row);
 if(r.error)return alert(r.error.message);clearAd();loadAds();
};
$("clear-ad").onclick=clearAd;
function clearAd(){editingAd=null;$("ad-name").value="";$("ad-code").value="";$("ad-mobile").checked=true;$("ad-desktop").checked=true;$("ad-enabled").checked=true;}
async function loadAds(){const {data,error}=await db.from("ads").select("*").order("created_at",{ascending:false});if(error)return alert(error.message);$("ads-list").innerHTML=(data||[]).map(a=>`<div class="item"><div><strong>${esc(a.name)}</strong><br><span class="badge">${esc(a.ad_type)}</span> <span class="badge">${esc(a.placement)}</span> ${a.enabled?"":"<span class='badge'>Off</span>"}</div><div><button onclick='editAd(${JSON.stringify(a).replace(/'/g,"&#39;")})'>Edit</button><button class="danger" onclick="deleteAd('${a.id}')">Delete</button></div></div>`).join("")||"<p>No ads yet.</p>";}
window.editAd=a=>{editingAd=a.id;$("ad-name").value=a.name||"";$("ad-type").value=a.ad_type||"Banner";$("ad-placement").value=a.placement||"top";$("ad-code").value=a.ad_code||"";$("ad-mobile").checked=!!a.show_mobile;$("ad-desktop").checked=!!a.show_desktop;$("ad-enabled").checked=!!a.enabled;scrollTo(0,0);}
window.deleteAd=async id=>{if(confirm("Delete this ad?")){const {error}=await db.from("ads").delete().eq("id",id);if(error)alert(error.message);else loadAds();}};
function esc(s=""){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
