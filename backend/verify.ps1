$baseUrl = "http://localhost:5000/api"

Write-Host "1. Testing Wallet Nonce..."
try {
    $nonce = Invoke-RestMethod -Uri "$baseUrl/auth/nonce/0x1234567890123456789012345678901234567890" -Method Get
    Write-Host "   Success! Nonce: $($nonce.nonce)"
} catch {
    Write-Host "   Failed to get nonce: $_"
}

Write-Host "`n2. Testing Get NFTs..."
try {
    $nfts = Invoke-RestMethod -Uri "$baseUrl/nfts" -Method Get
    Write-Host "   Success! NFT Count: $($nfts.Count)"
} catch {
    Write-Host "   Failed to get NFTs: $_"
}

Write-Host "`n3. Testing Market Items..."
try {
    $items = Invoke-RestMethod -Uri "$baseUrl/market/items" -Method Get
    Write-Host "   Success! Market Items Count: $($items.Count)"
} catch {
    Write-Host "   Failed to get Market Items: $_"
}
