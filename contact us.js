document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let message = document.getElementById("message").value;

    if (name === "" || email === "" || message === "") {
        document.getElementById("responseMessage").textContent = "All fields are required!";
    } else {
        document.getElementById("responseMessage").textContent = "Message sent successfully!";
    }
});