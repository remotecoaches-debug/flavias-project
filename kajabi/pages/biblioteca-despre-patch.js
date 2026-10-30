// Patch for /biblioteca and /despre: remote focus, replace stale Reels waitlist
(function(){
 var fp=document.querySelector('.fp'); if(!fp) return;
 var ann=fp.querySelector('.ann-track');
 if(ann){var h='';for(var i=0;i<4;i++){h+='<span>Job remote international, din Romania</span><span>Program nou: Job Remote in 90 de zile, cu garantie</span>';}ann.innerHTML=h;}
 fp.querySelectorAll('.marq-track span').forEach(function(s){s.textContent='Job remote. Salariu international.';});
 fp.querySelectorAll('a[href*="kit.com/000648c0b4"]').forEach(function(a){
  var c=a.closest('article');
  if(c&&c.parentNode&&c.parentNode.classList.contains('cards3')){c.innerHTML='<p class="label">Primul pas platit · 27 €</p><h3>Kitul <em>Job Remote</em></h3><p>100 de companii remote-first, template de CV ATS, checklist LinkedIn, 10 mesaje catre recrutori si planul de 7 zile.</p><a class="btn" href="https://www.flaviapopescu.eu/offers/3DKRXN3L/checkout">Vreau kitul</a>';}
  else if(c){c.innerHTML='<p class="label">Programul complet · cu garantie</p><h3>Job Remote in <em>90 de zile</em></h3><p>Iti scriem CV-ul si LinkedIn-ul, ai Yago 90 de zile si feedback pe WhatsApp. Daca aplici dupa plan si nu primesti niciun interviu in 90 de zile, lucram cu tine gratuit pana primesti.</p><p class="price-tag">1.497 €</p><a class="btn" href="/produse#program">Vezi programul</a>';}
 });
 var oh=fp.querySelector('.offer-head h2'); if(oh&&/lista/i.test(oh.textContent)) oh.innerHTML='Alege <em>pasul urmator</em>';
 fp.querySelectorAll('a').forEach(function(a){if(/Vezi Motorul de Reels/.test(a.textContent)){a.textContent='Vezi programele';a.setAttribute('href','/produse');}});
})();
