from fastapi import Request
from dotenv import dotenv_values
from openai import OpenAI

config = dotenv_values(".env")
client = OpenAI(api_key=config["OPENAI_API_KEY"])

# This one we will definitely use

async def translate_jargon(request: Request, description: str):
    content = description
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            max_tokens=1000,
            messages=[
                {"role": "system", "content": "You will be acting as a research assistant."
                    + "I will give you the description body of a kanban card. Take words from this kanban card that might be considered jargon and provide a one-sentence definition of each term in a way that could be easily understood by anyone.\n" 
                    + "RULES:\n"
                    + "1. If you are unsure of a definition, DO NOT guess.\n"
                    + "2. DO NOT summarize the text.\n"
                    + "3. Separate the term and definition with a colon. Do not otherwise use a colon in your response.\n"
                    + "4. Put each term on a new line.\n"
                    + "5. Do not preceed the term with ANY symbol (including a dash).\n"
                },
                {"role": "user", "content": "Here's the text:\n" + content}
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        return {"error": str(e)}

# This one we likely won't use, but I did it for fun to play with rules
# To use: cards need a "tags" field; call this API then update_card_field to update the tags

async def generate_tags(request: Request, description: str):
    content = description
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
            {"role": "system", "content": "You will be acting as a research assistant."
                + "I will give you the description body of a kanban card, and you will generate 3 tags that describe the text in one word.\n"
                + "RULES:\n"
                +  "1. stay in your role throughout the dialogue\n"
                +  "2. separate the tags by a single comma, DO NOT SEPARATE THEM IN ANY OTHER WAY\n"
                +  "3. include only the tags and the comma in your answer, no other text\n"
                +  "4. make sure the tags are only one word each and relevant to the description\n"
                +  "5. if technical vocuabulary (e.g. the term database) is used in the text, prioritize that as a tag\n"
                +  "6. do not just pick words from the text, focus on concepts"},
            {"role": "user", "content": "Here is the description:" + content + "\n"}]
        )
        return response.choices[0].message.content
    except Exception as e:
        return {"error": str(e)}

# Hi Caro!

# This one we should use 

async def suggest_title(request: Request, description: str):
    content = description
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            max_tokens=1000,
            messages=[
                {"role": "system", "content": "You will be acting as a research assistant."
                    + "You will suggest titles for kanban boards focusing on clarity and brevity, considering jargon's value.\n"
                    + "RULES:\n"
                    + "1. Title should be minimum 3 words, maximum 5 words, should be clear and concise.\n"
                    + "2. Keep title brief, ideally no longer than the original title, but still be descriptive enough.\n"
                    + "3. Use jargon if it adds clarity, but ensure it's widely understood.\n"
                    + "4. Use words that be easily understood by a non software engineer.\n"
                    + "5. Avoid using overly technical terms or acronyms.\n"
                    + "6. Ensure to describe each task that is in the title, include and if there is more than one task.\n"
                    + "7. Make sure that the title is properly formatted.\n"
                    + "8. Do not exclude any key details when suggesting a new title.\n"
                    + "9. Provide three suggestions."
                },
                {"role": "user", "content": "Here's the title:\n" + content}
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        return {"error": str(e)}