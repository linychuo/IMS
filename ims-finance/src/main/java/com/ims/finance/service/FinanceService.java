package com.ims.finance.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.ims.core.dto.PageResult;
import com.ims.core.dto.PageResult;
import com.ims.finance.dto.FinanceStatDTO;
import com.ims.finance.entity.AccountTransaction;
import com.ims.finance.mapper.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FinanceService {
    
    @Autowired
    private FinanceInMapper financeInMapper;
    @Autowired
    private FinanceOutMapper financeOutMapper;
    @Autowired
    private AccountMapper accountMapper;
    @Autowired
    private AccountTransactionMapper accountTransactionMapper;

    // ========== 收款管理 ==========
    public PageResult<FinanceIn> pageIn(Long page, Long pageSize, Long customerId, Integer status) {
        LambdaQueryWrapper<FinanceIn> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(customerId != null, FinanceIn::getCustomerId, customerId)
              .eq(status != null, FinanceIn::getStatus, status)
              .orderByDesc(FinanceIn::getId);
        Page<FinanceIn> result = financeInMapper.selectPage(new Page<>(page, pageSize), wrapper);
        return PageResult.of(result);
    }

    public FinanceIn getInById(Long id) {
        return financeInMapper.selectById(id);
    }

    @Transactional
    public boolean saveIn(FinanceIn in) {
        if (in.getId() == null) {
            in.setInNo(generateInNo());
            in.setPayDate(LocalDateTime.now());
            in.setStatus(1);
            return financeInMapper.insert(in) > 0;
        }
        return financeInMapper.updateById(in) > 0;
    }

    @Transactional
    public boolean auditIn(Long id, Long auditorId) {
        FinanceIn in = financeInMapper.selectById(id);
        if (in != null && in.getStatus() == 1) {
            in.setStatus(2);
            in.setAuditorId(auditorId);
            in.setAuditTime(LocalDateTime.now());
            return financeInMapper.updateById(in) > 0;
        }
        return false;
    }

    @Transactional
    public boolean cancelIn(Long id) {
        FinanceIn in = financeInMapper.selectById(id);
        if (in != null && in.getStatus() == 1) {
            in.setStatus(3);
            return financeInMapper.updateById(in) > 0;
        }
        return false;
    }

    @Transactional
    public boolean deleteIn(Long id) {
        FinanceIn in = financeInMapper.selectById(id);
        if (in != null && in.getStatus() == 1) {
            return financeInMapper.deleteById(id) > 0;
        }
        return false;
    }

    @Transactional
    public int batchAuditIn(List<Long> ids, Long auditorId) {
        int count = 0;
        for (Long id : ids) {
            if (auditIn(id, auditorId)) {
                count++;
            }
        }
        return count;
    }

    // ========== 付款管理 ==========
    public PageResult<FinanceOut> pageOut(Long page, Long pageSize, Long supplierId, Integer status) {
        LambdaQueryWrapper<FinanceOut> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(supplierId != null, FinanceOut::getSupplierId, supplierId)
              .eq(status != null, FinanceOut::getStatus, status)
              .orderByDesc(FinanceOut::getId);
        Page<FinanceOut> result = financeOutMapper.selectPage(new Page<>(page, pageSize), wrapper);
        return PageResult.of(result);
    }

    public FinanceOut getOutById(Long id) {
        return financeOutMapper.selectById(id);
    }

    @Transactional
    public boolean saveOut(FinanceOut out) {
        if (out.getId() == null) {
            out.setOutNo(generateOutNo());
            out.setPayDate(LocalDateTime.now());
            out.setStatus(1);
            return financeOutMapper.insert(out) > 0;
        }
        return financeOutMapper.updateById(out) > 0;
    }

    @Transactional
    public boolean auditOut(Long id, Long auditorId) {
        FinanceOut out = financeOutMapper.selectById(id);
        if (out != null && out.getStatus() == 1) {
            out.setStatus(2);
            out.setAuditorId(auditorId);
            out.setAuditTime(LocalDateTime.now());
            return financeOutMapper.updateById(out) > 0;
        }
        return false;
    }

    @Transactional
    public boolean cancelOut(Long id) {
        FinanceOut out = financeOutMapper.selectById(id);
        if (out != null && out.getStatus() == 1) {
            out.setStatus(3);
            return financeOutMapper.updateById(out) > 0;
        }
        return false;
    }

    @Transactional
    public boolean deleteOut(Long id) {
        FinanceOut out = financeOutMapper.selectById(id);
        if (out != null && out.getStatus() == 1) {
            return financeOutMapper.deleteById(id) > 0;
        }
        return false;
    }

    @Transactional
    public int batchAuditOut(List<Long> ids, Long auditorId) {
        int count = 0;
        for (Long id : ids) {
            if (auditOut(id, auditorId)) {
                count++;
            }
        }
        return count;
    }

    // ========== 账户管理 ==========
    public PageResult<Account> pageAccount(Long page, Long pageSize, Integer accountType, Integer status) {
        LambdaQueryWrapper<Account> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(accountType != null, Account::getAccountType, accountType)
              .eq(status != null, Account::getStatus, status)
              .orderByDesc(Account::getId);
        Page<Account> result = accountMapper.selectPage(new Page<>(page, pageSize), wrapper);
        return PageResult.of(result);
    }

    public Account getAccountById(Long id) {
        return accountMapper.selectById(id);
    }

    public List<Account> listAccount() {
        return accountMapper.selectList(new LambdaQueryWrapper<Account>().eq(Account::getStatus, 1));
    }

    @Transactional
    public boolean saveAccount(Account account) {
        if (account.getId() == null) {
            account.setAccountNo(generateAccountNo());
            account.setStatus(1);
            return accountMapper.insert(account) > 0;
        }
        return accountMapper.updateById(account) > 0;
    }

    @Transactional
    public boolean enableAccount(Long id) {
        Account account = accountMapper.selectById(id);
        if (account != null) {
            account.setStatus(1);
            return accountMapper.updateById(account) > 0;
        }
        return false;
    }

    @Transactional
    public boolean disableAccount(Long id) {
        Account account = accountMapper.selectById(id);
        if (account != null) {
            account.setStatus(2);
            return accountMapper.updateById(account) > 0;
        }
        return false;
    }

    @Transactional
    public boolean deleteAccount(Long id) {
        Account account = accountMapper.selectById(id);
        if (account != null && account.getStatus() == 1) {
            return accountMapper.deleteById(id) > 0;
        }
        return false;
    }

    private String generateInNo() {
        return "FIN" + System.currentTimeMillis();
    }

    private String generateOutNo() {
        return "FOUT" + System.currentTimeMillis();
    }

    private String generateAccountNo() {
        return "ACC" + System.currentTimeMillis();
    }

    // ========== 财务报表 ==========
    public FinanceStatDTO getStat() {
        // 收款统计
        LambdaQueryWrapper<FinanceIn> wrapperIn = new LambdaQueryWrapper<>();
        wrapperIn.select(FinanceIn::getAmount);
        List<FinanceIn> inList = financeInMapper.selectList(wrapperIn);
        BigDecimal totalIn = inList.stream()
            .map(FinanceIn::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        LambdaQueryWrapper<FinanceIn> wrapperPendingIn = new LambdaQueryWrapper<>();
        wrapperPendingIn.eq(FinanceIn::getStatus, 1);
        int pendingInCount = financeInMapper.selectCount(wrapperPendingIn).intValue();
        
        // 付款统计
        LambdaQueryWrapper<FinanceOut> wrapperOut = new LambdaQueryWrapper<>();
        wrapperOut.select(FinanceOut::getAmount);
        List<FinanceOut> outList = financeOutMapper.selectList(wrapperOut);
        BigDecimal totalOut = outList.stream()
            .map(FinanceOut::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        LambdaQueryWrapper<FinanceOut> wrapperPendingOut = new LambdaQueryWrapper<>();
        wrapperPendingOut.eq(FinanceOut::getStatus, 1);
        int pendingOutCount = financeOutMapper.selectCount(wrapperPendingOut).intValue();
        
        // Build stat result
        FinanceStatDTO stat = new FinanceStatDTO();
        stat.setTotalInAmount(totalIn);
        stat.setTotalOutAmount(totalOut);
        stat.setNetAmount(totalIn.subtract(totalOut));
        stat.setPendingInCount(pendingInCount);
        stat.setPendingOutCount(pendingOutCount);
        stat.setTotalInCount(inList.size());
        stat.setTotalOutCount(outList.size());
        return stat;
    }

    // ========== 账户交易历史 ==========
    public PageResult<AccountTransaction> pageAccountTrans(Long page, Long pageSize, Long accountId) {
        LambdaQueryWrapper<AccountTransaction> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(accountId != null, AccountTransaction::getAccountId, accountId)
              .orderByDesc(AccountTransaction::getId);
        Page<AccountTransaction> result = accountTransactionMapper.selectPage(new Page<>(page, pageSize), wrapper);
        return PageResult.of(result);
    }

    public List<AccountTransaction> listAccountTrans(Long accountId) {
        LambdaQueryWrapper<AccountTransaction> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(AccountTransaction::getAccountId, accountId)
              .orderByDesc(AccountTransaction::getId);
        return accountTransactionMapper.selectList(wrapper);
    }

    @Transactional
    public boolean saveAccountTrans(AccountTransaction trans) {
        if (trans.getId() == null) {
            // 更新账户余额
            Account account = accountMapper.selectById(trans.getAccountId());
            if (account != null) {
                BigDecimal balance = account.getBalance();
                if (trans.getTransType() == 1 || trans.getTransType() == 3) {
                    // 收款入账/调整增加
                    balance = balance.add(trans.getAmount());
                } else {
                    // 付款出账/调整减少
                    balance = balance.subtract(trans.getAmount());
                }
                account.setBalance(balance);
                accountMapper.updateById(account);
            }
            return accountTransactionMapper.insert(trans) > 0;
        }
        return false;
    }
}