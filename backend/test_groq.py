from llm.groq_client import call_groq

messages = [
    {
        "role": "system",
        "content": "You are a concise assistant. Answer in one short sentence.",
    },
    {
        "role": "user",
        "content": "Say hello and confirm you are working, in your own words.",
    },
]

print("Calling Groq...")
reply = call_groq(messages)
print("\n --- Response ---")
print(reply)
print("-------------------")

messages.append({"role": "assistant", "content": reply})
messages.append({"role": "user", "content": "What did you just say, word for word?"})

print("\n Calling Groq again with full history appended...")
reply2 = call_groq(messages)
print("\n --- Response ---")
print(reply2)
print("-------------------")