"""
Run: python test_pipeline.py
Tests the full assessment pipeline locally for user 6abe5bbe034a0374db76629e
"""
import asyncio
import os
from dotenv import load_dotenv
load_dotenv()

async def main():
    user_id = "6abe5bbe034a0374db76629e"
    
    print("=== STEP 1: Agent 1 - Fetch History ===")
    from app.agents import agent1_history
    result = await agent1_history.run(user_id)
    print(f"Topics found: {len(result['topics'])}")
    for t in result['topics']:
        print(f"  - {t['topic_title']} | snippets: {len(t['content_snippets'])}")
    if result['error']:
        print(f"ERROR: {result['error']}")
        return
    
    print("\n=== STEP 2: Agent 2 - Generate Questions ===")
    from app.agents import agent2_generator
    gen_result = await agent2_generator.run(result['topics'][:2], total_questions=5)
    print(f"Questions generated: {len(gen_result['questions'])}")
    if gen_result['error']:
        print(f"ERROR: {gen_result['error']}")
        return
    for q in gen_result['questions'][:2]:
        print(f"  Q{q['question_number']}: {q['question_text'][:80]}...")
    
    print("\n=== STEP 3: Agent 3 - Validate ===")
    from app.agents import agent3_validator
    val_result = await agent3_validator.run(gen_result['questions'])
    print(f"Valid: {len(val_result['valid_questions'])} | Invalid: {len(val_result['invalid_numbers'])}")
    
    print("\n=== ALL STEPS PASSED ===")

asyncio.run(main())
