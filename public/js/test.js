function test() {
    const emailInputElement = document.getElementById("email-input")
    const emailAsString = emailInputElement.value
    fetch("/savemail", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email: emailAsString})
    }).then(res => {
        alert(res.status);
    })
}