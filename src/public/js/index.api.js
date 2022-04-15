const load = async () => {
  if (content_scroll != undefined) {
    let res = await fetch('/api/resume');
    let json = await res.json();
  
    json.forEach(caso => {
      content_scroll.innerHTML += create_card(caso);
    });
  }
}

const getById = async id => {
  let status
  try {
    let res = await fetch(`/api/case-by-id?id=${id}`);
    status = res.status;
    let json = await res.json();
    return json
  } catch (error) {
    if (status = 401) {
      alert('sin autorizaacion')
      location.reload()
    } else alert('La id debe se un numero')
    return []
  }

}

const getByName = async name => {
  let status
  try {
    let res = await fetch(`/api/case-by-name?name=${name}`);
    status = res.status;
    let json = await res.json();
    return json
  } catch (error) {
    if (status = 401) {
      alert('sin autorizaacion')
      location.reload()
    } else alert('La id debe se un numero')
    return []
  }

}

const getByCedula = async cedula => {
  let status
  try {
    let res = await fetch(`/api/case-by-cedula?cedula=${cedula}`);
    status = res.status
    let json = await res.json();
    return json
  } catch (error) {
    if (status = 401) {
      alert('sin autorizaacion')
      location.reload()
    } else alert('La cedula debe se un numero')
    return []
  }
}

const postBody = async (url, data) => {
  let object = {};
  data.forEach((value, key) => object[key] = value);
  let json = JSON.stringify(object);
  return await fetch(url, {
    method: 'POST',
    body: json,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

const alertErrors = async res => {
  if (res.status == 401) {
    alert('sin autorizaacion')
    location.reload()
  } else {
    let errors = await res.json()
    let msg = '';
    errors.forEach(e => {
      msg += e.msg + '\n';
    })
    alert(`error: ${msg}`)
  }
}

const createCaso = async e => {
  let data = e.formData

  let res = await postBody('/api/registro', data)

  console.log(res.ok);
  if (res.ok) alert('Caso creado')
  else {
    alertErrors(res)
  }
}

const updateState = async e => {
  let data = e.formData
  data.append("ID", document.getElementById('id').innerText.slice(4))

  let res = await postBody('/api/update-case', data)

  if (res.ok) alert('Caso actualizado')
  else {
    alertErrors(res)
  }
}

const createUser = async e => {
  let data = e.formData
  let res = await postBody('/api/signup', data)

  if (res.ok) alert('Usuario creado')
  else {
    alertErrors(res)
  }
}