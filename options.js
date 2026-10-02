const $ = (id) => document.getElementById(id);

chrome.storage.local.get(["user", "pass"], ({ user, pass }) => {
  $("user").value = user || "";
  $("pass").value = pass || "";
});

$("save").addEventListener("click", async () => {
  await chrome.storage.local.set({ user: $("user").value.trim(), pass: $("pass").value });
  $("status").textContent = "Salvo!";
  setTimeout(() => ($("status").textContent = ""), 2000);
});
