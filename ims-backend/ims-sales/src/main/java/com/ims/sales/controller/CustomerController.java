package com.ims.sales.controller;

import com.ims.sales.entity.Customer;
import com.ims.sales.service.CustomerService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 客户管理控制器
 */
@RestController
@RequestMapping("/api/sales/customer")
public class CustomerController {

    private static final Logger log = LoggerFactory.getLogger(CustomerController.class);

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    /**
     * 创建客户
     */
    @PostMapping
    public ResponseEntity<Customer> create(@Valid @RequestBody Customer customer) {
        return ResponseEntity.ok(customerService.create(customer));
    }

    /**
     * 更新客户
     */
    @PutMapping("/{id}")
    public ResponseEntity<Customer> update(@PathVariable String id,
                                      @Valid @RequestBody Customer customer) {
        return ResponseEntity.ok(customerService.update(id, customer));
    }

    /**
     * 根据ID查询
     */
    @GetMapping("/{id}")
    public ResponseEntity<Customer> getById(@PathVariable String id) {
        return ResponseEntity.ok(customerService.getById(id));
    }

    /**
     * 根据编码查询
     */
    @GetMapping("/code/{customerCode}")
    public ResponseEntity<Customer> getByCode(@PathVariable String customerCode) {
        return ResponseEntity.ok(customerService.getByCode(customerCode));
    }

    /**
     * 查询列表
     */
    @GetMapping("/list")
    public ResponseEntity<List<Customer>> list(@ModelAttribute Customer query) {
        return ResponseEntity.ok(customerService.list(query));
    }

    /**
     * 删除
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        customerService.delete(id);
        return ResponseEntity.noContent().build();
    }
}