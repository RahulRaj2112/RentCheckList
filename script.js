document.addEventListener("DOMContentLoaded", function() {
    let totalBalance = Array.from(document.querySelectorAll(".amount"))
        .map(td => parseFloat(td.textContent.replace(/,/g, '')))
        .reduce((a, b) => a + b, 0);

    const balanceDisplay = document.getElementById("balance");
    balanceDisplay.textContent = totalBalance.toLocaleString();

    const checkboxes = document.querySelectorAll(".rent-checkbox");
    const popup = document.getElementById("popup");
    const overlay = document.getElementById("overlay");
    const resetPopup = document.getElementById("reset-popup");
    const confirmUnselectPopup = document.getElementById("confirm-unselect-popup");
    const resetButton = document.getElementById("reset-button");
    const yesReset = document.getElementById("yes-reset");
    const noReset = document.getElementById("no-reset");
    const yesUnselect = document.getElementById("yes-unselect");
    const noUnselect = document.getElementById("no-unselect");

    let currentCheckbox = null;
    let unselectCheckbox = null;

    function updateBalance() {
        let paidAmount = 0;
        checkboxes.forEach((checkbox, index) => {
            if (checkbox.checked) {
                let amountText = checkbox.closest("tr").querySelector(".amount").textContent;
                paidAmount += parseFloat(amountText.replace(/,/g, ''));
            }
        });

        let remainingBalance = totalBalance - paidAmount;
        balanceDisplay.textContent = remainingBalance.toLocaleString('en-IN');  // Properly format with commas
    }

    checkboxes.forEach((checkbox, index) => {
        const paymentMethodSpan = checkbox.nextElementSibling;
        const row = checkbox.closest("tr");
        const storedChecked = localStorage.getItem(`rent-checkbox-${index}`);
        const storedMethod = localStorage.getItem(`payment-method-${index}`);

        if (storedChecked === "true") {
            checkbox.checked = true;
            row.classList.add("highlight");
            if (storedMethod) {
                paymentMethodSpan.textContent = storedMethod;
            }
        }

        checkbox.addEventListener("change", function() {
            if (checkbox.checked) {
                currentCheckbox = checkbox;
                popup.style.display = "block";
                overlay.style.display = "block";
                row.classList.add("highlight");
            } else {
                unselectCheckbox = checkbox;
                confirmUnselectPopup.style.display = "block";
                overlay.style.display = "block";
            }
        });

        updateBalance(); // Ensure balance updates on load
    });

    function selectPayment(method) {
        if (currentCheckbox) {
            const index = Array.from(checkboxes).indexOf(currentCheckbox);
            const paymentMethodSpan = currentCheckbox.nextElementSibling;
            paymentMethodSpan.textContent = method;
            localStorage.setItem(`payment-method-${index}`, method);
            localStorage.setItem(`rent-checkbox-${index}`, true);
            updateBalance();
        }
        popup.style.display = "none";
        overlay.style.display = "none";
    }

    document.getElementById("gpay").addEventListener("click", function() {
        selectPayment("GPay");
    });

    document.getElementById("cash").addEventListener("click", function() {
        selectPayment("Cash");
    });

    yesUnselect.addEventListener("click", function() {
        if (unselectCheckbox) {
            const index = Array.from(checkboxes).indexOf(unselectCheckbox);
            const row = unselectCheckbox.closest("tr");
            const paymentMethodSpan = unselectCheckbox.nextElementSibling;
            unselectCheckbox.checked = false;
            paymentMethodSpan.textContent = "";
            row.classList.remove("highlight");
            localStorage.removeItem(`payment-method-${index}`);
            localStorage.setItem(`rent-checkbox-${index}`, false);
            updateBalance();
        }
        confirmUnselectPopup.style.display = "none";
        overlay.style.display = "none";
    });

    noUnselect.addEventListener("click", function() {
        if (unselectCheckbox) {
            unselectCheckbox.checked = true; // Keep it checked
        }
        confirmUnselectPopup.style.display = "none";
        overlay.style.display = "none";
    });

    resetButton.addEventListener("click", function() {
        resetPopup.style.display = "block";
        overlay.style.display = "block";
    });

    yesReset.addEventListener("click", function() {
        localStorage.clear();
        location.reload();
    });

    noReset.addEventListener("click", function() {
        resetPopup.style.display = "none";
        overlay.style.display = "none";
    });

    updateBalance();
});

