#!/bin/bash
# Script to add test data via API

BASE_URL="http://localhost:8080"

echo "Logging in..."
TOKEN=$(curl -s "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "Failed to login"
  exit 1
fi

echo "Token obtained: ${TOKEN:0:50}..."
echo ""

add_customer() {
  local name="$1"
  local contact="$2"
  local phone="$3"
  local type="$4"
  curl -s "$BASE_URL/api/customer" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"$name\",\"contact\":\"$contact\",\"phone\":\"$phone\",\"type\":$type,\"status\":1,\"code\":\"C$(date +%s)\"}"
  echo ""
}

add_supplier() {
  local name="$1"
  local contact="$2"
  local phone="$3"
  curl -s "$BASE_URL/api/supplier" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"$name\",\"contact\":\"$contact\",\"phone\":\"$phone\",\"status\":1,\"code\":\"S$(date +%s)\"}"
  echo ""
}

add_product() {
  local name="$1"
  local code="$2"
  local price="$3"
  local categoryId="$4"
  curl -s "$BASE_URL/api/product" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"$name\",\"code\":\"$code\",\"price\":$price,\"status\":1,\"categoryId\":$categoryId}"
  echo ""
}

echo "=== Adding Customers ==="
add_customer "测试客户-北京公司" "张三" "13800138001" 2
add_customer "测试客户-上海贸易" "李四" "13800138002" 2
add_customer "测试客户-广州企业" "王五" "13800138003" 2
add_customer "测试客户-深圳科技" "赵六" "13800138004" 1
add_customer "测试客户-杭州实业" "钱七" "13800138005" 2

echo ""
echo "=== Adding Suppliers ==="
add_supplier "测试供应商-广东实业" "刘一" "13900139001"
add_supplier "测试供应商-浙江贸易" "陈二" "13900139002"
add_supplier "测试供应商-江苏制造" "周三" "13900139003"
add_supplier "测试供应商-山东原料" "吴四" "13900139004"
add_supplier "测试供应商-福建商品" "郑五" "13900139005"

echo ""
echo "=== Adding Products ==="
add_product "测试商品-手机" "PHO001" "2999.00" 1
add_product "测试商品-电脑" "PHO002" "5999.00" 1
add_product "测试商品-耳机" "PHO003" "299.00" 2
add_product "测试商品-键盘" "PHO004" "199.00" 2
add_product "测试商品-鼠标" "PHO005" "99.00" 2
add_product "测试商品-显示器" "PHO006" "1299.00" 1
add_product "测试商品-充电宝" "PHO007" "149.00" 2
add_product "测试商品-数据线" "PHO008" "29.00" 2

echo ""
echo "=== Verifying Data ==="
echo "Customers:"
curl -s "$BASE_URL/api/customer/page?current=1&size=10" -H "Authorization: Bearer $TOKEN" | grep -o '"total":[0-9]*'

echo "Products:"
curl -s "$BASE_URL/api/product/list" -H "Authorization: Bearer $TOKEN" | grep -o '"total":[0-9]*'

echo ""
echo "Done!"