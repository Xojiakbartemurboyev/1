const nameInput = document.getElementById("nameInput");
const numberInput = document.getElementById("numberInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("list");

let contacts = JSON.parse(localStorage.getItem("contacts_v2") || "[]");
let editIndex = -1;

function save() {
  localStorage.setItem("contacts_v2", JSON.stringify(contacts));
}

function render() {
  list.innerHTML = "";
  if (!contacts.length) {
    list.innerHTML = `<div class="empty">📭 No contacts yet. Add one above!</div>`;
    return;
  }

  contacts.forEach((c, i) => {
    const item = document.createElement("div");
    item.className = "item";
    item.innerHTML = `
      <div class="left">
        <div class="avatar">${(c.name || "?").charAt(0).toUpperCase()}</div>
        <div class="meta">
          <div class="name">${escapeHtml(c.name)}</div>
          <div class="number">${escapeHtml(c.number)}</div>
        </div>
      </div>
      <div class="actions">
        <button class="icon-btn edit" data-index="${i}" title="Edit">✏️</button>
        <button class="icon-btn delete" data-index="${i}" title="Delete">🗑️</button>
      </div>
    `;
    list.appendChild(item);
  });

  document.querySelectorAll(".edit").forEach(btn => {
    btn.addEventListener("click", () => startEdit(+btn.dataset.index));
  });

  document.querySelectorAll(".delete").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = +btn.dataset.index;
      if (confirm("Haqiqatan ham o‘chirmoqchimisiz?")) {
        contacts.splice(idx, 1);
        save();
        render();
      }
    });
  });
}

function escapeHtml(text) {
  return text.replaceAll("&", "&amp;")
             .replaceAll("<", "&lt;")
             .replaceAll(">", "&gt;");
}

function addOrSave() {
  const name = nameInput.value.trim();
  const number = numberInput.value.trim();

  if (!name) {
    alert("Iltimos, ism kiriting!");
    return;
  }

  if (editIndex >= 0) {
    contacts[editIndex] = { name, number };
    editIndex = -1;
    addBtn.textContent = "+ Add Contact";
  } else {
    contacts.push({ name, number });
  }

  nameInput.value = "";
  numberInput.value = "";
  save();
  render();
}

function startEdit(i) {
  editIndex = i;
  const c = contacts[i];
  nameInput.value = c.name;
  numberInput.value = c.number;
  addBtn.textContent = "💾 Save";
  nameInput.focus();
}

addBtn.addEventListener("click", addOrSave);
numberInput.addEventListener("keydown", e => e.key === "Enter" && addOrSave());
nameInput.addEventListener("keydown", e => e.key === "Enter" && numberInput.focus());

render();
