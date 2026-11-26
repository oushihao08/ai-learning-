---
id: fl-06-ip-ownership-labor-2n-and-tax-4flow
type: fault-line
title: 科技公司三大日常暗坑：外包源码归乙方、愤怒裁员赔2N、专票四流红线
domain: legal
mastery: mapped
confidence: 0.35
hubs:
  - mos-02-state-locks-and-gates
  - mos-03-asymmetric-payoff
edges:
  - rel: assimilates_into
    target: mos-02-state-locks-and-gates
  - rel: breaks_intuition_of
    target: mos-04-lateral-restructure
  - rel: related_lens
    target: mm-03-evidence-log-hierarchy
tags:
  - legal
  - ip
  - labor
  - tax
related:
  - mos-02-state-locks-and-gates
  - mos-03-asymmetric-payoff
  - mm-03-evidence-log-hierarchy
evidence_refs: []
created: 2026-11-26
updated: 2026-11-26
---

# 科技公司三大日常暗坑：外包源码归乙方、愤怒裁员赔2N、专票四流红线

## 挂入我的母法

直挂 [[mos-02-state-locks-and-gates]]，并对 [[mos-04-lateral-restructure]] 标记 **`breaks_intuition_of`**：知产默认归属、劳动倾斜保护与增值税专票规则**完全反商业直觉**，凭常识拍板必亏钱！

## 主帅必抓的 20% 胜负开关

1. **花钱找外包写代码，没写归属 = 版权默认归乙方！**（《著作权法》委托作品默认规则）：兼职/外包开发合同漏写“全部知识产权及未加密源码归甲方所有”，钱付完了代码版权却是人家的；反过来给大客户做定制时，必须切开“我方既有底层框架永久授权 vs 客户定制层归属”，别把自家底座卖断！
2. **劳动仲裁是“用人单位举证倒置”**：微信里一怒说句“你明天不用来了”= 铁板钉钉违法解除赔 **`2N`**（甚至员工不要求 2N 而要求“继续履行合同”，官司打一年你白养他一年工资！）；签了竞业限制离职时忘了书面取消，人家去小公司坐等领你每月 30% 竞业补偿金！
3. **税务“先开专票后收款”与“四流合一”红线**：专票一开出去，哪怕客户跑路一分钱没给你，你也得先真金白银把增值税交了；为了方便拿 A 公司签合同、B 公司走账、C 公司开专票，一旦脱离真实交易极易触发**虚开增值税专用发票稽查**（且税务复议必须**先缴清税款滞纳金**才能提！）。

## 直接甩给 AI 干的 80% 细节（不必深学）

- 员工手册民主公示流程文本、开源协议（GPL/Apache/MIT）传染性逐包扫描、进项税额转出与滞纳金封顶核算，全交 AI 执行。

## 行话切口与防忽悠镇场

- **核心行话对译**：`委托作品著作权默认归受托人`｜`违法解除 2N vs 协商一致 N`｜`竞业限制断缴三个月劳动者单方解除权`｜`四流一致（合同流/资金流/发票流/货物流或服务流）`｜`善意取得虚开专票`。
- **律师常见忽悠**：给初创公司全员套模板签高额竞业协议，却不提醒老板“人离职那天没发《放弃竞业通知书》就得白掏一年补偿金”。
- **老板一招试深浅**：「*第一，这份定制合同有没有把我们的通用 Agent 底座剥离保留？第二，开除这个不胜任员工，走协商 N 划算还是硬刚违纪的败诉赔率高？*」
