
    // Simple expense tracker with localStorage persistence
    const KEY = "my_expenses_v1";

    const expenseForm = document.getElementById("expenseForm");
    const descInput = document.getElementById("description");
    const catInput = document.getElementById("category");
    const amountInput = document.getElementById("amount");
    const expenseListEl = document.getElementById("expenseList");
    const clearAllBtn = document.getElementById("clearAll");

    const totalEl = document.getElementById("totalAmount");
    const catFoodEl = document.getElementById("catFood");
    const catCollegeEl = document.getElementById("catCollege");
    const catTransportEl = document.getElementById("catTransport");
    const catOthersEl = document.getElementById("catOthers");

    let expenses = [];
    let editIndex = -1; // -1 means not editing

    // load from localStorage
    function load() {
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) expenses = JSON.parse(raw) || [];
      } catch (e) {
        expenses = [];
      }
      render();
    }

    function save() {
      localStorage.setItem(KEY, JSON.stringify(expenses));
    }

    function formatCurrency(n) {
      // change to your local currency/format if needed
      return "₹" + Number(n).toFixed(2);
    }

    function render() {
      expenseListEl.innerHTML = "";
      let total = 0;
      const cats = { Food:0, "College Fees":0, Transportation:0, Others:0 };

      expenses.forEach((exp, i) => {
        total += Number(exp.amount);
        cats[exp.category] = (cats[exp.category] || 0) + Number(exp.amount);

        const tr = document.createElement("tr");

        const idxTd = document.createElement("td");
        idxTd.textContent = i + 1;

        const descTd = document.createElement("td");
        descTd.textContent = exp.description;

        const catTd = document.createElement("td");
        catTd.textContent = exp.category;

        const amountTd = document.createElement("td");
        amountTd.className = "amount";
        amountTd.textContent = formatCurrency(exp.amount);

        const actionsTd = document.createElement("td");
        actionsTd.className = "actions";

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "edit";
        editBtn.type = "button";
        editBtn.addEventListener("click", () => startEdit(i));

        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.className = "delete";
        delBtn.type = "button";
        delBtn.addEventListener("click", () => removeExpense(i));

        actionsTd.appendChild(editBtn);
        actionsTd.appendChild(delBtn);

        tr.appendChild(idxTd);
        tr.appendChild(descTd);
        tr.appendChild(catTd);
        tr.appendChild(amountTd);
        tr.appendChild(actionsTd);

        expenseListEl.appendChild(tr);
      });

      totalEl.textContent = formatCurrency(total);
      catFoodEl.textContent = formatCurrency(cats.Food || 0);
      catCollegeEl.textContent = formatCurrency(cats["College Fees"] || 0);
      catTransportEl.textContent = formatCurrency(cats.Transportation || 0);
      catOthersEl.textContent = formatCurrency(cats.Others || 0);
    }

    function startEdit(index) {
      const exp = expenses[index];
      if (!exp) return;
      descInput.value = exp.description;
      catInput.value = exp.category;
      amountInput.value = exp.amount;
      editIndex = index;
      // focus description for quick edit
      descInput.focus();
    }

    function removeExpense(index) {
      if (!confirm("Delete this expense?")) return;
      expenses.splice(index, 1);
      save();
      render();
      // if we deleted the item being edited, reset edit mode
      if (editIndex === index) {
        editIndex = -1;
        expenseForm.reset();
      }
    }

    expenseForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const description = descInput.value.trim();
      const category = catInput.value;
      const amount = parseFloat(amountInput.value);

      if (!description || !category || isNaN(amount) || amount < 0) {
        alert("Please provide valid description, category and amount.");
        return;
      }

      const newExpense = { description, category, amount: amount.toFixed(2) };

      if (editIndex >= 0) {
        // save edit
        expenses[editIndex] = newExpense;
        editIndex = -1;
      } else {
        expenses.push(newExpense);
      }

      save();
      render();
      expenseForm.reset();
      descInput.focus();
    });

    clearAllBtn.addEventListener("click", () => {
      if (!expenses.length) return alert("No expenses to clear.");
      if (!confirm("Clear all expenses?")) return;
      expenses = [];
      save();
      render();
      expenseForm.reset();
      editIndex = -1;
    });

    // initialize
    load();

