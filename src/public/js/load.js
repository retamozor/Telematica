let content_scroll, info, search, agregar, close_btn, form
document.addEventListener("DOMContentLoaded", () => {
  content_scroll = document.getElementsByClassName("content-scroll")[0];
  info = document.getElementById('info')
  search = document.getElementById("enter")
  agregar = document.getElementById('agregar')
  close_btn = document.getElementById('close')
  form = document.getElementById('form');
  if (search != undefined) search.onkeydown = keypress;
  if (agregar != undefined) agregar.onclick = set_form;
  if (close_btn != undefined) close_btn.onclick = close;
  if (info != undefined) info.hidden = true;
  if (form != undefined) {
    form.onsubmit = preventSubmit;
    form.onformdata = createUser;
  }

  load()
});