# Testing Rules

Each test must verify one behavior.
Keep tests small and focused.
Avoid multi-scenario tests.

# Naming

Name tests by observable behavior.
Avoid vague names.

# Behavior

Test observable behavior, not implementation details.
Do not test private functions.
Do not assert internal state or internal variables.
Avoid coupling tests to internal structure.

# Determinism

Keep tests deterministic.
Do not depend on randomness, real time, or system state.
Mock time and randomness when required.

# Isolation

Isolate the unit under test.
Mock external services, network, filesystem, and other external systems.
Do not call real external systems in unit tests.

# Test Data

Keep test data minimal.
Include only fields required for the test.
Avoid large fixtures.
Prefer small explicit objects.

# Assertions

Assert meaningful outcomes.
Avoid weak assertions such as only defined or only truthy checks.
Validate expected behavior.

# Setup

Avoid duplicated setup.
Extract shared setup into helpers or factories.
Keep tests readable.

# Side Effects

Do not leave side effects between tests.
Reset mocks.
Restore modified globals.
Clean timers and resources.
Each test must run independently.

# Async

Always await async operations.
Fail tests on unexpected promise rejections.
Avoid unhandled promise rejections.

# Error Cases

Cover failure paths.
Test invalid inputs and boundary cases.

# Mocking

Mock only external dependencies.
Do not mock the unit under test.
Prefer lightweight mocks.

# Readability

Arrange data clearly.
Separate setup, action, and assertions.
Prefer Arrange, Act, Assert.

# Code Changes

Update tests when behavior changes.
Add tests for new behavior.
Do not remove tests without replacement.
