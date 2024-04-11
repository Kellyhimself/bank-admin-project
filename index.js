document.addEventListener("DOMContentLoaded", () => {
  const nameInfo = document.getElementById("nameInfo");
  const balanceInfo = document.getElementById("balanceInfo");

  const idInfo = document.getElementById("idInfo");

  const emailInfo = document.getElementById("emailInfo");

  const typeInfo = document.getElementById("typeInfo");

  const accountForm = document.getElementById("accountForm");

  const accountInfo = document.getElementById("accountInfo");

  //add a delete button
  const deleteButton = document.createElement("button", (id = "deleteButton"));
  deleteButton.innerText = "delete";
  //add an update button
  const updateButton = document.createElement("button", (id = "updateButton"));
  updateButton.innerText = "update account";

  const updateForm = document.createElement("form", (id = "updateForm"));
  // Get the filter input
  const filterInput = document.getElementById("filterInput");

  //display

  function display() {
    //display all accounts available
    fetch("http://localhost:3000/accounts") //fetch the accounts data from server
      .then((res) => res.json())
      .then((accounts) => {
        const accountNames = accounts.map((account) => account.name);
        accountNames.forEach((accountName) => {
          const li = document.createElement("li");
          li.textContent = accountName;
          const accountList = document.getElementById("accountList");
          accountList.appendChild(li);

          //adding event listener to the filter
          filterInput.addEventListener("input", () => {
            // Get the filter value
            const filterValue = filterInput.value.toLowerCase();
            // Filter the list of accounts
            for (let i = 0; i < accountList.children.length; i++) {
              // Get the account text
              const accountText =
                accountList.children[i].textContent.toLowerCase();
              // Hide the account if it doesn't start with the filter value
              if (!accountText.startsWith(filterValue)) {
                accountList.children[i].style.display = "none";
              } else {
                accountList.children[i].style.display = "";
              }
            }
          });
        });
      });

    //displays highest balance account
    fetch("http://localhost:3000/accounts")
      .then((res) => res.json())
      .then((accounts) => {
        // Get the maximum balance from the array of accounts

        const maxBalance = Math.max(
          ...accounts.map((account) => account.balance)
        );

        for (const account of accounts) {
          if (account.balance === maxBalance) {
            const highestBalanceP = document.getElementById("highestBalanceP");
            highestBalanceP.textContent = `Account with highest balance: ${account.name}`;
            const balanceP = document.querySelector("#balanceP");
            balanceP.innerText = `balance: sh. ${account.balance}`;
          }
        }
      });
  }
  display();
  //event listener to our accountList elements
  accountList.addEventListener("click", (e) => {
    //check if its a list element clicked
    if (e.target.nodeName === "LI") {
      //check if there is an unsubmitted updateForm
      if (updateForm) {
        updateForm.remove(); //remove it
      }
      //style the clicked list element/name
      const liElements = accountList.querySelectorAll("li");
      liElements.forEach((element) => {
        element.classList.remove("highlight");
      });
      e.target.classList.add("highlight");
      accountInfo.appendChild(deleteButton);
      accountInfo.appendChild(updateButton);

      //fetch data to display the account info
      fetch("http://localhost:3000/accounts")
        .then((res) => res.json())
        .then((accounts) => {
          //find the account clicked from our database
          const accountClicked = accounts.find(
            (account) => account.name === e.target.textContent
          );

          nameInfo.innerText = `name: ${accountClicked.name}`;
          idInfo.innerText = `id: ${accountClicked.id}`;
          emailInfo.innerText = `email: ${accountClicked.email}`;
          balanceInfo.innerText = `balance: ${accountClicked.balance}`;
          typeInfo.innerText = `account type: ${accountClicked.type}`;

          //event listener to the deleteButton

          deleteButton.addEventListener("click", () => {
            //delete account from the server

            fetch(`http://localhost:3000/accounts/${accountClicked.id}`, {
              method: "DELETE",
            }).then((response) => {
              if (response.ok) {
                alert("Account deleted successfully.");
              } else {
                alert("Error deleting account.");
              }
            });
          });

          //update an account in the server
          updateButton.addEventListener("click", (e) => {
            e.preventDefault();

            //a simple form to get necessary update data

            updateForm.innerHTML = `
            <input type="text" name="name" placeholder="Name" value="${accountClicked.name}" />
            <input type="email" name="email" placeholder="Email" value="${accountClicked.email}" />
            <input type="number" name="balance" placeholder="Balance" value="${accountClicked.balance}" />
            <select name="type">
              <option value="transactional">Transactional</option>
              <option value="savings">Savings</option>
            </select>
            <input type="submit" value="submit new details" class="submit-button"/>
          `;
            //append the form to the accountInfo
            accountInfo.appendChild(updateForm);
            //add event liostener on submit of the update account
            updateForm.addEventListener("submit", (e) => {
              e.preventDefault();
              //get the updated values from the form
              const formData = new FormData(updateForm);
              const updatedAccount = {
                id: accountClicked.id,
                name: formData.get("name"),
                email: formData.get("email"),
                balance: formData.get("balance"),
                type: formData.get("type"),
              };

              //make a FETCH PUT request to update the account
              fetch(`http://localhost:3000/accounts/${accountClicked.id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedAccount),
              }).then((res) => {
                if (res.ok) {
                  alert("account succesfully updated");
                  updateForm.querySelectorAll("input").forEach((input) => {
                    input.value = "";
                  });
                } else {
                  alert("error updating account");
                }
              });
            });
          });
        });
    }
  });

  accountForm.addEventListener("submit", (e) => {
    e.preventDefault();

    //gets the accounts input to our database

    const name = document.getElementById("name").value;
    const idNumber = document.getElementById("idNumber").value;
    const balance = Number(document.getElementById("balance").value);
    const email = document.getElementById("email").value;
    const type = document.getElementById("type").value;

    //fetch data from API and then POST the new account created

    fetch("http://localhost:3000/accounts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: name,
        id: idNumber,
        balance: balance,
        email: email,
        type: type,
      }),
    })
      .then((res) => {
        if (res.ok) {
          //account succesfully created
          alert("account succefully added");
          accountForm.querySelectorAll("input").forEach((input) => {
            input.value = "";
          });
        } else {
          alert("error creating the account");
        }
      })
      .catch((error) => {
        alert("error creating the account");
      });
  });
});
