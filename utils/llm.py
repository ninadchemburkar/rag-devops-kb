from groq import Groq

def getAnswer(apiKey, context, question):
    try:
        client = Groq(api_key=apiKey)
        
        prompt = f"""You are a DevOps engineer answering questions from internal runbooks and documentation.
Use only the context below to answer. If the answer isn't in the context, say so clearly.

Context:
{chr(10).join(context)}

Question: {question}"""

        res = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3
        )
        return res.choices[0].message.content
    except Exception as e:
        raise RuntimeError(f"Groq API error: {e}. Double-check your API key in the sidebar.")