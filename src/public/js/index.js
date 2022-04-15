timeago.register('es_ES', (_number, index, _total_sec) => [
  ['justo ahora', 'ahora mismo'],
  ['hace %s segundos', 'en %s segundos'],
  ['hace 1 minuto', 'en 1 minuto'],
  ['hace %s minutos', 'en %s minutos'],
  ['hace 1 hora', 'en 1 hora'],
  ['hace %s horas', 'in %s horas'],
  ['hace 1 dia', 'en 1 dia'],
  ['hace %s dias', 'en %s dias'],
  ['hace 1 semana', 'en 1 semana'],
  ['hace %s semanas', 'en %s semanas'],
  ['1 mes', 'en 1 mes'],
  ['hace %s meses', 'en %s meses'],
  ['hace 1 año', 'en 1 año'],
  ['hace %s años', 'en %s años']
][index]);

const image = sexo => {
  if (sexo == 1 || sexo == 'Masculino') return 'man.svg'
  else if (sexo == 2 || sexo == 'Femenino') return 'woman.svg'
  else return 'other.svg'
}
const virus = result => {
  if (result == 1 || result == 'Positivo') return '<img class="virus" src="/resource/virus.svg" alt="">'
  else return ''
}

const showInfo = async id => {
  let caso = await getById(id);
  console.log(caso);
  set_info(caso[0])
}

const keypress = async e => {
  if (e.code == "Enter" || e.code == "NumpadEnter" || e.which == 13) {
    content_scroll.innerHTML = '';
    let type = e.path[1].children[2].value;
    let busqueda = e.srcElement.value
    if (busqueda == '') load()
    else {
      let names
      switch (type) {
        case 'nombre':
          names = await getByName(busqueda);
          break;
        case 'id':
          names = await getById(busqueda);
          break;
        case 'cedula':
          names = await getByCedula(busqueda);
          break;

        default:
          break;
      }

      names.forEach(caso => {
        content_scroll.innerHTML += create_card(caso);
      });
    }
  }
}

const close = e => {
  console.log(e)
  e.srcElement.parentElement.hidden = true
}

const preventSubmit = e => {
  e.preventDefault();
  console.log(e);
  new FormData(e.srcElement)
}