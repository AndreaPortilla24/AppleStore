(async ()=>{
  try{
    const res = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: 'admin@applestore.com', password: 'admin123' })
    });
    const txt = await res.text();
    console.log(txt);
  }catch(e){
    console.error('ERR', e.message);
    process.exit(1);
  }
})();
