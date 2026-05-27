# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e-test-data.spec.ts >> IMS Test Data Creation >> 12. Add Notification
- Location: e2e-test-data.spec.ts:431:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('button:has-text("确定"), button:has-text("发送")').first()
    - locator resolved to <button type="button" class="ant-btn css-dev-only-do-not-override-tql0nm css-var-root ant-btn-primary ant-btn-color-primary ant-btn-variant-solid">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="ant-modal-wrap">…</div> from <div>…</div> subtree intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="ant-modal-wrap">…</div> from <div>…</div> subtree intercepts pointer events
    - retrying click action
      - waiting 100ms
    39 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div class="ant-modal-wrap">…</div> from <div>…</div> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e3]:
    - complementary [ref=e4]:
      - generic [ref=e5]:
        - generic [ref=e6]: 进销存系统
        - menu [ref=e7]:
          - menuitem "pie-chart 报表中心" [ref=e8] [cursor=pointer]:
            - img "pie-chart" [ref=e9]:
              - img [ref=e10]
            - generic [ref=e12]: 报表中心
          - menuitem "container 仓库管理" [ref=e13] [cursor=pointer]:
            - img "container" [ref=e14]:
              - img [ref=e15]
            - generic [ref=e17]: 仓库管理
          - menuitem "shopping-cart 商品管理" [ref=e18] [cursor=pointer]:
            - img "shopping-cart" [ref=e19]:
              - img [ref=e20]
            - generic [ref=e22]: 商品管理
          - menuitem "user 客户管理" [ref=e23] [cursor=pointer]:
            - img "user" [ref=e24]:
              - img [ref=e25]
            - generic [ref=e27]: 客户管理
          - menuitem "shop 供应商管理" [ref=e28] [cursor=pointer]:
            - img "shop" [ref=e29]:
              - img [ref=e30]
            - generic [ref=e32]: 供应商管理
          - menuitem "shopping-cart 销售管理" [ref=e33] [cursor=pointer]:
            - img "shopping-cart" [ref=e34]:
              - img [ref=e35]
            - generic [ref=e37]: 销售管理
          - menuitem "inbox 采购管理" [ref=e38] [cursor=pointer]:
            - img "inbox" [ref=e39]:
              - img [ref=e40]
            - generic [ref=e42]: 采购管理
          - menuitem "inbox 库存管理" [ref=e43] [cursor=pointer]:
            - img "inbox" [ref=e44]:
              - img [ref=e45]
            - generic [ref=e47]: 库存管理
          - menuitem "dollar 财务管理" [ref=e48] [cursor=pointer]:
            - img "dollar" [ref=e49]:
              - img [ref=e50]
            - generic [ref=e52]: 财务管理
          - menuitem "setting 系统管理" [ref=e53] [cursor=pointer]:
            - img "setting" [ref=e54]:
              - img [ref=e55]
            - generic [ref=e57]: 系统管理
    - generic [ref=e58]:
      - banner [ref=e59]:
        - button "menu-fold" [ref=e60] [cursor=pointer]:
          - img "menu-fold" [ref=e62]:
            - img [ref=e63]
        - generic [ref=e65]:
          - img "user" [ref=e68]:
            - img [ref=e69]
          - generic [ref=e71]: 系统管理员
      - main [ref=e72]:
        - generic [ref=e73]:
          - heading "消息通知" [level=2] [ref=e74]
          - generic [ref=e75]:
            - generic [ref=e77]:
              - generic [ref=e79]:
                - generic [ref=e80]: 通知总数
                - img "bell" [ref=e82]:
                  - img [ref=e83]
              - generic [ref=e85]: "0"
            - generic [ref=e87]:
              - generic [ref=e90]: 已发布
              - generic [ref=e91]: "0"
            - generic [ref=e93]:
              - generic [ref=e96]: 待办提醒
              - generic [ref=e97]: "0"
          - button "plus 发送通知" [ref=e99] [cursor=pointer]:
            - img "plus" [ref=e101]:
              - img [ref=e102]
            - generic [ref=e105]: 发送通知
          - table [ref=e112]:
            - rowgroup [ref=e121]:
              - row "通知标题 类型 优先级 状态 已读 发布时间 操作" [ref=e122]:
                - columnheader "通知标题" [ref=e123]
                - columnheader "类型" [ref=e124]
                - columnheader "优先级" [ref=e125]
                - columnheader "状态" [ref=e126]
                - columnheader "已读" [ref=e127]
                - columnheader "发布时间" [ref=e128]
                - columnheader "操作" [ref=e129]
            - rowgroup [ref=e130]:
              - row "暂无数据 暂无数据" [ref=e131]:
                - cell "暂无数据 暂无数据" [ref=e132]:
                  - generic [ref=e134]:
                    - img "暂无数据" [ref=e136]
                    - generic [ref=e142]: 暂无数据
  - generic [ref=e143]:
    - dialog "发送通知":
      - generic [ref=e144]:
        - button "Close" [ref=e145] [cursor=pointer]:
          - generic "关闭" [ref=e146]:
            - img "close" [ref=e147]:
              - img [ref=e148]
        - generic [ref=e151]: 发送通知
        - generic [ref=e153]:
          - generic [ref=e155]:
            - generic "通知标题" [ref=e157]: "* 通知标题"
            - textbox "* 通知标题" [ref=e161]:
              - /placeholder: 请输入通知标题
              - text: 测试通知_1779718054865
          - generic [ref=e162]:
            - generic [ref=e165]:
              - generic "通知类型" [ref=e167]
              - generic [ref=e171] [cursor=pointer]:
                - generic "系统通知" [ref=e172]:
                  - text: 系统通知
                  - combobox "通知类型" [ref=e173]
                - img "down" [ref=e175]:
                  - img [ref=e176]
            - generic [ref=e180]:
              - generic "优先级" [ref=e182]
              - generic [ref=e186] [cursor=pointer]:
                - generic "低" [ref=e187]:
                  - text: 低
                  - combobox "优先级" [ref=e188]
                - img "down" [ref=e190]:
                  - img [ref=e191]
          - generic [ref=e194]:
            - generic "发送范围" [ref=e196]
            - generic [ref=e200] [cursor=pointer]:
              - generic "全体人员" [ref=e201]:
                - text: 全体人员
                - combobox "发送范围" [ref=e202]
              - img "down" [ref=e204]:
                - img [ref=e205]
          - generic [ref=e208]:
            - generic "通知内容" [ref=e210]: "* 通知内容"
            - textbox "* 通知内容" [active] [ref=e214]:
              - /placeholder: 请输入通知内容
              - text: 这是一条测试通知，用于测试系统通知功能。
        - generic [ref=e215]:
          - button "取 消" [ref=e216] [cursor=pointer]:
            - generic [ref=e217]: 取 消
          - button "确 定" [ref=e218] [cursor=pointer]:
            - generic [ref=e219]: 确 定
```

# Test source

```ts
  356 |     const addBtn = page.locator('button:has-text("新增付款"), button:has-text("新增应付")');
  357 |     if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  358 |       await addBtn.click();
  359 |       await page.waitForTimeout(1000);
  360 | 
  361 |       const amountInput = page.locator('input[id*="amount"], input[placeholder*="金额"]').first();
  362 |       if (await amountInput.isVisible({ timeout: 2000 }).catch(() => false)) {
  363 |         await amountInput.fill('2000.00');
  364 | 
  365 |         const submitBtn = page.locator('button:has-text("确定"), button:has-text("保存")').first();
  366 |         if (await submitBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
  367 |           await submitBtn.click();
  368 |           await page.waitForTimeout(2000);
  369 |           console.log('Payable record added successfully');
  370 |         }
  371 |       }
  372 | 
  373 |       await page.keyboard.press('Escape');
  374 |     }
  375 | 
  376 |     await page.screenshot({ path: '/tmp/ims-payable-added.png', fullPage: true });
  377 |   });
  378 | 
  379 |   test('10. Create Inventory Inbound', async ({ page }) => {
  380 |     await loginViaUI(page);
  381 | 
  382 |     await page.goto(`${BASE_URL}/inventory/in`);
  383 |     await page.waitForLoadState('networkidle');
  384 |     await page.waitForTimeout(2000);
  385 | 
  386 |     console.log('On inventory inbound page');
  387 | 
  388 |     const addBtn = page.locator('button:has-text("新增入库"), button:has-text("新增入库单")');
  389 |     if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  390 |       await addBtn.click();
  391 |       await page.waitForTimeout(1000);
  392 | 
  393 |       const submitBtn = page.locator('button:has-text("确定"), button:has-text("保存")').first();
  394 |       if (await submitBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
  395 |         await submitBtn.click();
  396 |         await page.waitForTimeout(2000);
  397 |         console.log('Inbound record added successfully');
  398 |       }
  399 |     }
  400 | 
  401 |     await page.keyboard.press('Escape');
  402 |     await page.screenshot({ path: '/tmp/ims-inbound-added.png', fullPage: true });
  403 |   });
  404 | 
  405 |   test('11. Create Inventory Outbound', async ({ page }) => {
  406 |     await loginViaUI(page);
  407 | 
  408 |     await page.goto(`${BASE_URL}/inventory/out`);
  409 |     await page.waitForLoadState('networkidle');
  410 |     await page.waitForTimeout(2000);
  411 | 
  412 |     console.log('On inventory outbound page');
  413 | 
  414 |     const addBtn = page.locator('button:has-text("新增出库"), button:has-text("新增出库单")');
  415 |     if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  416 |       await addBtn.click();
  417 |       await page.waitForTimeout(1000);
  418 | 
  419 |       const submitBtn = page.locator('button:has-text("确定"), button:has-text("保存")').first();
  420 |       if (await submitBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
  421 |         await submitBtn.click();
  422 |         await page.waitForTimeout(2000);
  423 |         console.log('Outbound record added successfully');
  424 |       }
  425 |     }
  426 | 
  427 |     await page.keyboard.press('Escape');
  428 |     await page.screenshot({ path: '/tmp/ims-outbound-added.png', fullPage: true });
  429 |   });
  430 | 
  431 |   test('12. Add Notification', async ({ page }) => {
  432 |     await loginViaUI(page);
  433 | 
  434 |     await page.goto(`${BASE_URL}/system/notification`);
  435 |     await page.waitForLoadState('networkidle');
  436 |     await page.waitForTimeout(2000);
  437 | 
  438 |     console.log('On notification page');
  439 | 
  440 |     const addBtn = page.locator('button:has-text("新增通知"), button:has-text("发送通知")');
  441 |     if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  442 |       await addBtn.click();
  443 |       await page.waitForTimeout(1000);
  444 | 
  445 |       const titleInput = page.locator('input[id*="title"], input[placeholder*="标题"]').first();
  446 |       if (await titleInput.isVisible({ timeout: 2000 }).catch(() => false)) {
  447 |         await titleInput.fill('测试通知_' + Date.now());
  448 | 
  449 |         const contentInput = page.locator('textarea[id*="content"], textarea[placeholder*="内容"]');
  450 |         if (await contentInput.isVisible({ timeout: 1000 }).catch(() => false)) {
  451 |           await contentInput.fill('这是一条测试通知，用于测试系统通知功能。');
  452 |         }
  453 | 
  454 |         const submitBtn = page.locator('button:has-text("确定"), button:has-text("发送")').first();
  455 |         if (await submitBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
> 456 |           await submitBtn.click();
      |                           ^ Error: locator.click: Test timeout of 30000ms exceeded.
  457 |           await page.waitForTimeout(2000);
  458 |           console.log('Notification added successfully');
  459 |         }
  460 |       }
  461 | 
  462 |       await page.keyboard.press('Escape');
  463 |     }
  464 | 
  465 |     await page.screenshot({ path: '/tmp/ims-notification-added.png', fullPage: true });
  466 |   });
  467 | 
  468 |   test('13. Add Sales Price Strategy', async ({ page }) => {
  469 |     await loginViaUI(page);
  470 | 
  471 |     await page.goto(`${BASE_URL}/sales/price-strategy`);
  472 |     await page.waitForLoadState('networkidle');
  473 |     await page.waitForTimeout(2000);
  474 | 
  475 |     console.log('On sales price strategy page');
  476 | 
  477 |     const addBtn = page.locator('button:has-text("新增策略"), button:has-text("新增价格策略")');
  478 |     if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  479 |       await addBtn.click();
  480 |       await page.waitForTimeout(1000);
  481 | 
  482 |       const priceInput = page.locator('input[id*="price"], input[placeholder*="价格"]').first();
  483 |       if (await priceInput.isVisible({ timeout: 2000 }).catch(() => false)) {
  484 |         await priceInput.fill('88.88');
  485 | 
  486 |         const submitBtn = page.locator('button:has-text("确定"), button:has-text("保存")').first();
  487 |         if (await submitBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
  488 |           await submitBtn.click();
  489 |           await page.waitForTimeout(2000);
  490 |           console.log('Price strategy added successfully');
  491 |         }
  492 |       }
  493 | 
  494 |       await page.keyboard.press('Escape');
  495 |     }
  496 | 
  497 |     await page.screenshot({ path: '/tmp/ims-price-strategy-added.png', fullPage: true });
  498 |   });
  499 | 
  500 |   test('14. Add Print Template', async ({ page }) => {
  501 |     await loginViaUI(page);
  502 | 
  503 |     await page.goto(`${BASE_URL}/system/print-template`);
  504 |     await page.waitForLoadState('networkidle');
  505 |     await page.waitForTimeout(2000);
  506 | 
  507 |     console.log('On print template page');
  508 | 
  509 |     const addBtn = page.locator('button:has-text("新增模板"), button:has-text("新增打印模板")');
  510 |     if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  511 |       await addBtn.click();
  512 |       await page.waitForTimeout(1000);
  513 | 
  514 |       const nameInput = page.locator('input[id*="name"], input[placeholder*="模板名称"]').first();
  515 |       if (await nameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
  516 |         await nameInput.fill('测试打印模板_' + Date.now());
  517 | 
  518 |         const submitBtn = page.locator('button:has-text("确定"), button:has-text("保存")').first();
  519 |         if (await submitBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
  520 |           await submitBtn.click();
  521 |           await page.waitForTimeout(2000);
  522 |           console.log('Print template added successfully');
  523 |         }
  524 |       }
  525 | 
  526 |       await page.keyboard.press('Escape');
  527 |     }
  528 | 
  529 |     await page.screenshot({ path: '/tmp/ims-print-template-added.png', fullPage: true });
  530 |   });
  531 | 
  532 |   test('15. Add System Config', async ({ page }) => {
  533 |     await loginViaUI(page);
  534 | 
  535 |     await page.goto(`${BASE_URL}/system/config`);
  536 |     await page.waitForLoadState('networkidle');
  537 |     await page.waitForTimeout(2000);
  538 | 
  539 |     console.log('On system config page');
  540 | 
  541 |     const addBtn = page.locator('button:has-text("新增配置"), button:has-text("新增系统参数")');
  542 |     if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  543 |       await addBtn.click();
  544 |       await page.waitForTimeout(1000);
  545 | 
  546 |       const keyInput = page.locator('input[id*="configKey"], input[placeholder*="参数键"]').first();
  547 |       if (await keyInput.isVisible({ timeout: 2000 }).catch(() => false)) {
  548 |         await keyInput.fill('TEST_CONFIG_' + Date.now());
  549 | 
  550 |         const valueInput = page.locator('input[id*="configValue"], input[placeholder*="参数值"]');
  551 |         if (await valueInput.isVisible({ timeout: 1000 }).catch(() => false)) {
  552 |           await valueInput.fill('test_value');
  553 |         }
  554 | 
  555 |         const submitBtn = page.locator('button:has-text("确定"), button:has-text("保存")').first();
  556 |         if (await submitBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
```