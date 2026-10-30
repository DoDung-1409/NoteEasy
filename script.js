
const titleInput = document.getElementById("noteTitle");
const contentInput = document.getElementById("noteContent");
const saveBtn = document.getElementById("saveBtn");
const searchInput = document.getElementById("searchInput");
const notesList = document.getElementById("notesList");

let notes = JSON.parse(localStorage.getItem("notes")) || [];
let editingId = null;

function saveToStorage() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function renderNotes(keyword = "") {
  notesList.innerHTML = "";

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(keyword.toLowerCase()) ||
    note.content.toLowerCase().includes(keyword.toLowerCase())
  );

  if (filteredNotes.length === 0) {
    notesList.innerHTML =
      '<p class="empty">Chưa có ghi chú nào.</p>';
    return;
  }

  filteredNotes.forEach(note => {
    const card = document.createElement("div");
    card.className = "note";

    const heading = document.createElement("h3");
    heading.textContent = note.title;

    const content = document.createElement("p");
    content.textContent = note.content;

    const editBtn = document.createElement("button");
    editBtn.textContent = "Sửa";
    editBtn.addEventListener("click", () => editNote(note.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Xóa";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", () => deleteNote(note.id));

    card.append(heading, content, editBtn, deleteBtn);
    notesList.appendChild(card);
  });
}

saveBtn.addEventListener("click", () => {
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) {
    alert("Vui lòng nhập đầy đủ tiêu đề và nội dung!");
    return;
  }

  if (editingId !== null) {
    notes = notes.map(note =>
      note.id === editingId
        ? { ...note, title, content }
        : note
    );
    editingId = null;
    saveBtn.textContent = "Lưu ghi chú";
  } else {
    notes.unshift({
      id: Date.now(),
      title,
      content
    });
  }

  saveToStorage();
  titleInput.value = "";
  contentInput.value = "";
  renderNotes(searchInput.value);
});

function editNote(id) {
  const note = notes.find(item => item.id === id);

  if (!note) return;

  titleInput.value = note.title;
  contentInput.value = note.content;
  editingId = id;
  saveBtn.textContent = "Cập nhật ghi chú";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteNote(id) {
  if (!confirm("Bạn có chắc muốn xóa ghi chú này?")) return;

  notes = notes.filter(note => note.id !== id);
  saveToStorage();

  if (editingId === id) {
    editingId = null;
    titleInput.value = "";
    contentInput.value = "";
    saveBtn.textContent = "Lưu ghi chú";
  }

  renderNotes(searchInput.value);
}

searchInput.addEventListener("input", () => {
  renderNotes(searchInput.value);
});

renderNotes();
