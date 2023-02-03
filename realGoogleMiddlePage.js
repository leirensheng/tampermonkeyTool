

(async function () {
    console.time();
    let res = new URL(location.href).searchParams.get('url')
    window.open(res)
    // location.replace(1,res)

  

  })();
  