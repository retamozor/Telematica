let content_scroll, info, search, agregar
document.addEventListener("DOMContentLoaded", () => {
  content_scroll = document.getElementsByClassName("content-scroll")[0];
  info = document.getElementById('info')
  search = document.getElementById("enter")
  search.onkeydown = keypress;
  agregar = document.getElementById('agregar')
  agregar.onclick = set_form;
  document.getElementById('close').onclick = close;
  info.hidden=true;
  load()
});