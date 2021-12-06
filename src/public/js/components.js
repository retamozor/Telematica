// components //
const create_card = caso => {
  return `<div class="card" onclick="showInfo(${caso.id})">
    <div class="rows">
      <div>
        <div class="profile-circle small" alt="">
          <img class="avatar" src="/resource/${image(caso.sexo)}" alt="">
        </div>
      </div>
      <div>
        <h3>${caso.nombre}</h3>
        <p class="info">CC. ${caso.cedula}</p>
        <p class="info">id: ${caso.id}</p>
      </div>
      ${virus(caso.examen)}
    </div>
    <p class="timeago">Realizado ${timeago.format(caso.fecha, 'es_ES')}</p>
  </div>`
}

const set_info = data => {
  info.hidden = false
  info.innerHTML = `
    <div class="rows">
      <div>
        <div class="profile-circle small" alt="">
          <img class="avatar" src="/resource/${image(data.sexo)}" alt="">
        </div>
      </div>
      <div>
        <h3>${data.nombre}</h3>
        <p class="info">cc. ${data.cedula}</p>
        <div class="rows">
          <p class="info" id="id">id: ${data.id}</p>
          <p class="info">sex: ${data.sexo}</p>
        </div>
      </div>
    </div>
    <p class="info">nació: ${new Date(data.nacimiento).toLocaleString('es-Co')}</p>
    <p class="info">Apartmento: ${data.residencia}</p>
    <p class="info">trabajo: ${data.trabajo} </p>
    <p class="info">Resultado: ${data.examen} </p>
    <p class="info">Realizado ${timeago.format(data.fecha, 'es_ES')}</p>
    <form action="/actualizar-caso" method="POST" id="form">
      <div class="box">
        <select name="estado" id="estado" class="form-input">
          <option value="1">Tratamiento en casa</option>
          <option value="2">Tratamiento en hospital</option>
          <option value="3">En UCI</option>
          <option value="4">Curado</option>
          <option value="5">Muerte</option>
        </select>
        <label class="form-label bg-white" for="estado">Estado del usuario</label>
      </div>
      <div class="box">
        <input type="submit" name="submit" value="actualizar">
      </div>
    </form>
    <button class="close_btn" id="close"></button>`
  document.getElementById('close').onclick = close;
  let form = document.getElementById('form');
  form.onsubmit = preventSubmit;
  form.onformdata = updateState;
  
}

const set_form = () => {
  info.hidden = false
  info.innerHTML = `
  <form action="/api/registro" method="POST" id="form">
    <div class="box">
      <input name="nombre" class="form-input" type="text" id="apellido" placeholder=" ">
      <label class="form-label" for="nombre">Nombre </label>
    </div>

    <div class="box">
      <input name="cedula" class="form-input" type="number" id="cedula" placeholder=" ">
      <label class="form-label" for="cedula"> C&eacute;dula </label>
    </div>

    <div class="box">
      <select name="sexo" class="form-input" type="text" id="sexo">
        <option value="1">Masculino</option>
        <option value="2">Femenino</option>
        <option value="3">Otro</option>
      </select>
      <label class="form-label" for="sexo"> Sexo </label>
    </div>

    <div class="box">
      <input name="nacimiento" class="form-time" id="nacimiento" type="date">
      <label class="form-label" for="nacimiento"> Fecha de nacimiento </label>
    </div>

    <div class="box">
      <input name="residencia" class="form-input" type="text" id="direccion de residencia"
        placeholder=" ">
      <label class="form-label" for="direccion de residencia"> Direcci&oacute;n de residencia </label>
    </div>

    <div class="box">
      <input name="trabajo" class="form-input" type="text" id="direccion de trabajo" placeholder=" ">
      <label class="form-label" for="direccion de trabajo">Direcci&oacute;n de trabajo </label>
    </div>

    <div class="box">
      <select name="resultado" class="form-input" type="text" id="resultado del examen">
        <option value="1">Positivo</option>
        <option value="2">Negativo</option>
      </select>
      <label class="form-label" for="resultado del examen"> Resultado del examen </label>
    </div>

    <div class="box">
      <input name="fecha_del_examen" class="form-time" id="fecha del examen" type="date">
      <label class="form-label" for="fecha del examen"> Fecha del examen </label>
    </div>
    
    <div class="box">
      <input name="hora_del_examen" class="form-time" id="hora del examen" type="time">
      <label class="form-label" for="hora del examen"> Hora del examen </label>
    </div>

    <input type="submit" value="registrar"></input>
  </form>
  <button class="close_btn" id="close"></button>`
  document.getElementById('close').onclick = close;
  let form = document.getElementById('form');
  form.onsubmit = preventSubmit;
  form.onformdata = createCaso;
}