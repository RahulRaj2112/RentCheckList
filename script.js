document.addEventListener("DOMContentLoaded", function() {
    const checkboxes = document.querySelectorAll(".rent-checkbox");
    const balanceDisplay = document.getElementById("balance");

    // Calculate total rent
    let totalBalance = Array.from(document.querySelectorAll(".amount"))
        .map(td => parseFloat(td.textContent))
        .reduce((a, b) => a + b, 0);
    
    balanceDisplay.textContent = totalBalance;

    function updateBalance() {
        let paidAmount = Array.from(checkboxes).reduce((sum, checkbox) => {
            if (checkbox.checked) {
                return sum + parseFloat(checkbox.closest("tr").querySelector(".amount").textContent);
            }
            return sum;
        }, 0);
        balanceDisplay.textContent = totalBalance - paidAmount;
    }

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", function() {
            const row = checkbox.closest("tr");

            if (checkbox.checked) {
                row.classList.add("highlight");
            } else {
                row.classList.remove("highlight");
            }

            updateBalance();
        });
    });

    // Reset functionality
    document.getElementById("reset-button").addEventListener("click", function() {
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
            checkbox.closest("tr").classList.remove("highlight");
        });
        updateBalance();
    });
});
