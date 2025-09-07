function scroll() {
    window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth'
    });
}

function load() {
    window.main = document.getElementById("main")
}

function keyPress(event, element) {
    if (event.key == 'Enter' && element.value != "") {
        console.log(element.value)
        const newText = document.createElement("p")
        newText.classList.add("user-input")
        newText.textContent = element.value
        main.appendChild(newText)
        process(element.value)
        element.value = ""
    }
}

async function process(input) {
    window.model = document.getElementById("model").value
    
    if (puter.auth && typeof puter.auth.isSignedIn === "function" && model != "NB1")  {
        const signed = await puter.auth.isSignedIn();
        if (!signed) {
            alert("Sign in is required to use this service")
            await puter.auth.signIn();
        }
    }

    try {
        const newText = document.createElement("p");
        newText.classList.add("bot-output");
        main.appendChild(newText);
        scroll()
        newText.textContent = "Thinking...."

        let response = ""
        let text = ""
        if (model == "NB1") {
            text = nathanBot(input)
        } else {
            response = await puter.ai.chat(input, {model: model});
            console.log(response)
            text = response?.message?.content ?? "[no message returned]";
        }

        newText.textContent = ""

        // Gradually append characters for a typing effect
        let i = 0;
        const interval = setInterval(() => {
            newText.textContent += text[i];
            scroll()
            i++;
            if (i >= text.length) clearInterval(interval);
        }, 8);

    } catch (err) {
        console.error("API error:", err);
        const newText = document.createElement("p");
        newText.classList.add("bot-output");
        newText.textContent = "API error: " + (err?.message ?? String(err));
        main.appendChild(newText);
    }
}

function nathanBot(input) {
  let output = "Sorry I don't understand";

  const greetings = ["hi", "hey", "hello", "what's up", "wassup", "good", "sup", "yo"];
  const text = String(input).toLowerCase();

  for (let i = 0; i < greetings.length; i++) {
    if (text.includes(greetings[i])) {
      output = "Hi there.";
      break;
    }
  }

  return output;
}

