#!/bin/bash

# Error Handling Test Script
# Run this to test all error scenarios

BASE_URL="http://localhost:5000/api"

echo "🧪 Testing NFT Marketplace Error Handling"
echo "=========================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

test_count=0
pass_count=0

run_test() {
    test_count=$((test_count + 1))
    local test_name=$1
    local expected_status=$2
    local response=$3
    
    echo -e "${YELLOW}Test $test_count: $test_name${NC}"
    
    # Extract status from response (simplified)
    if echo "$response" | grep -q "\"success\":false"; then
        echo -e "${GREEN}✓ PASS${NC} - Error handled correctly"
        pass_count=$((pass_count + 1))
    else
        echo -e "${RED}✗ FAIL${NC} - Unexpected response"
    fi
    echo "$response" | jq '.' 2>/dev/null || echo "$response"
    echo ""
}

# Test 1: Invalid Registration (Missing Fields)
echo "1️⃣ Testing Validation Errors"
echo "----------------------------"
response=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{}')
run_test "Missing registration fields" 400 "$response"

# Test 2: Invalid Email Format
response=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"invalid","password":"123456"}')
run_test "Invalid email format" 400 "$response"

# Test 3: Short Password
response=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"123"}')
run_test "Password too short" 400 "$response"

echo ""
echo "2️⃣ Testing Authentication Errors"
echo "--------------------------------"

# Test 4: Invalid Login
response=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"nonexistent","password":"wrong"}')
run_test "Invalid login credentials" 401 "$response"

# Test 5: Missing Token
response=$(curl -s -X GET "$BASE_URL/users/profile")
run_test "Missing JWT token" 401 "$response"

echo ""
echo "3️⃣ Testing Wallet Validation"
echo "----------------------------"

# Test 6: Invalid Wallet Address
response=$(curl -s -X GET "$BASE_URL/auth/nonce/invalid_address")
run_test "Invalid wallet address format" 400 "$response"

# Test 7: Invalid Signature Format
response=$(curl -s -X POST "$BASE_URL/auth/verify" \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1","signature":"invalid"}')
run_test "Invalid signature format" 400 "$response"

echo ""
echo "4️⃣ Testing Not Found Errors"
echo "---------------------------"

# Test 8: Non-existent NFT
response=$(curl -s -X GET "$BASE_URL/nfts/99999")
run_test "Non-existent NFT" 404 "$response"

# Test 9: Invalid Route
response=$(curl -s -X GET "$BASE_URL/invalid/route")
run_test "Invalid API route" 404 "$response"

echo ""
echo "5️⃣ Testing Success Cases (Sanity Check)"
echo "---------------------------------------"

# Test 10: Health Check
response=$(curl -s -X GET "http://localhost:5000/health")
if echo "$response" | grep -q "\"success\":true"; then
    echo -e "${GREEN}✓ Health check passed${NC}"
    pass_count=$((pass_count + 1))
else
    echo -e "${RED}✗ Health check failed${NC}"
fi
echo "$response" | jq '.' 2>/dev/null || echo "$response"
echo ""

# Test 11: Valid Registration (if user doesn't exist)
response=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"testuser_$(date +%s)\",\"email\":\"test_$(date +%s)@test.com\",\"password\":\"password123\"}")
if echo "$response" | grep -q "\"success\":true"; then
    echo -e "${GREEN}✓ Valid registration passed${NC}"
    pass_count=$((pass_count + 1))
else
    echo -e "${YELLOW}⚠ Registration test (may fail if user exists)${NC}"
fi
echo "$response" | jq '.' 2>/dev/null || echo "$response"
echo ""

# Summary
echo "=========================================="
echo "📊 Test Summary"
echo "=========================================="
echo "Total Tests: $test_count"
echo -e "Passed: ${GREEN}$pass_count${NC}"
echo -e "Failed: ${RED}$((test_count - pass_count))${NC}"
echo ""

if [ $pass_count -eq $test_count ]; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠ Some tests failed${NC}"
    exit 1
fi
