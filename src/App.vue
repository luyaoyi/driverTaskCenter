<template>
  <el-container style="height: 100vh; min-height: 100vh; background: #f5f6f8">
    <!-- ========== 顶部 Header ========== -->
    <el-header
      style="
        height: 56px;
        padding: 0;
        background: #fff;
        border-bottom: 1px solid #eef0f3;
        position: sticky;
        top: 0;
        z-index: 20;
        display: flex;
        align-items: center;
      "
    >
      <!-- 折叠按钮 -->
      <el-button
        text
        class="top-icon-btn"
        style="margin-left: 8px"
        @click="collapsed = !collapsed"
      >
        <el-icon :size="18">
          <component :is="collapsed ? 'Expand' : 'Fold'" />
        </el-icon>
      </el-button>

      <!-- 顶部导航菜单 -->
      <el-menu
        mode="horizontal"
        :default-active="topActive"
        class="top-nav-menu"
        style="flex: 1; border-bottom: none"
      >
        <el-menu-item index="mp">营销平台</el-menu-item>
        <el-menu-item index="dp">数据平台</el-menu-item>
        <el-menu-item index="co">频道运营</el-menu-item>
        <el-menu-item index="ao">活动运营</el-menu-item>
        <el-sub-menu index="more">
          <template #title>
            <span>更多</span>
            <el-icon style="margin-left: 4px; font-size: 10px"
              ><ArrowDown
            /></el-icon>
          </template>
          <el-menu-item index="m1">商城运营</el-menu-item>
          <el-menu-item index="m2">内容管理</el-menu-item>
        </el-sub-menu>
      </el-menu>

      <!-- 搜索框 -->
      <el-input
        v-model="topSearch"
        placeholder="菜单搜索、编号搜索、名称搜索"
        size="default"
        clearable
        style="width: 260px; margin: 0 12px"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <!-- 右侧按钮区 -->
      <el-dropdown>
        <el-button class="env-user">
          <el-icon style="vertical-align: -2px; margin-right: 4px">
          <User />
        </el-icon>
          <el-icon style="vertical-align: -2px; margin: 0 4px"><CaretBottom /></el-icon>
          卢晓丹
        </el-button>
      </el-dropdown>

      <el-dropdown style="margin: 0 8px">
        <el-button class="env-prod">
          <el-icon style="vertical-align: -2px; margin-right: 4px"><Guide /></el-icon>
          正式环境
          <el-icon style="vertical-align: -2px; margin-left: 4px"
            ><CaretBottom
          /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>测试环境</el-dropdown-item>
            <el-dropdown-item>预发布环境</el-dropdown-item>
            <el-dropdown-item>正式环境</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-button class="top-icon-btn" size="default">
        <el-icon :size="18"><HomeFilled /></el-icon>
      </el-button>
      <el-badge :value="3" :max="99" class="top-icon-btn">
        <el-button class="top-icon-btn" size="default">
          <el-icon :size="18"><Bell /></el-icon>
        </el-button>
      </el-badge>
      <el-button class="top-icon-btn" size="default">
        <el-avatar :size="28" style="background: #3ab0ff">
          <el-icon><User /></el-icon>
        </el-avatar>
      </el-button>
      <el-button class="top-icon-btn" size="default">
        <el-avatar :size="28" style="background: #ff9a45">
          <el-icon><Service /></el-icon>
        </el-avatar>
      </el-button>
    </el-header>

    <el-container>
      <!-- ========== 侧边栏：真车主任务中心 ========== -->
      <el-aside
        :width="(collapsed ? '64px' : '220px')"
        style="
          background: #fff;
          border-right: 1px solid #eef0f3;
          transition: width 0.25s;
          overflow: hidden;
        "
      >
        <div class="sider-scroll">
          <span v-if="!collapsed" class="biz-tag">真车主</span>

          <el-menu
            class="sider-menu"
            :default-active="activeMenu"
            :default-openeds="['owner-task']"
            :collapse="collapsed"
            :collapse-transition="false"
            background-color="#ffffff"
            text-color="#333333"
            active-text-color="#1677ff"
            @select="onMenuSelect"
          >
            <el-sub-menu index="owner-task">
              <template #title>
                <el-icon><Van /></el-icon>
                <span>真车主任务中心</span>
              </template>
              <el-menu-item index="task-config">
                <el-icon><Setting /></el-icon>
                <span>任务配置管理</span>
              </el-menu-item>
              <el-menu-item index="task-data">
                <el-icon><DataBoard /></el-icon>
                <span>任务参与记录</span>
              </el-menu-item>
            </el-sub-menu>
          </el-menu>
        </div>
      </el-aside>

      <el-main style="padding: 0; background: #f5f6f8">
        <!-- ========== Tabs 页签栏 ========== -->
        <div class="tabs-bar">
          <el-tabs
            v-model="activeTab"
            type="card"
            class="custom-tabs"
            :tab-bar-style="{'border-bottom': 'none'}"
          >
            <el-tab-pane
              v-for="tab in tabs"
              :key="tab.key"
              :name="tab.key"
              :class="['custom-tab', { 'custom-home-tab': tab.key === 'home' }]"
            >
              <template #label>
                <span style="display: inline-flex; align-items: center">
                  <el-icon v-if="tab.key === 'home'" style="margin-right: 4px">
                    <HomeFilled />
                  </el-icon>
                  {{ tab.label }}
                  <el-icon
                    v-if="tab.closable"
                    class="tab-close"
                    @click.stop="removeTab(tab.key)"
                  >
                    <Close />
                  </el-icon>
                </span>
              </template>
            </el-tab-pane>
          </el-tabs>
        </div>

        <!-- ========== 面包屑 + 主内容 ========== -->
        <div style="padding: 16px 20px 0; min-width: 0">
          <el-breadcrumb separator="/" style="margin-bottom: 16px">
            <el-breadcrumb-item>真车主任务中心</el-breadcrumb-item>
            <el-breadcrumb-item v-if="activeTab === 'task-config'">
              <b style="color: #333">任务配置管理</b>
            </el-breadcrumb-item>
            <el-breadcrumb-item v-else-if="activeTab === 'task-data'">
              <b style="color: #333">任务参与记录</b>
            </el-breadcrumb-item>
            <el-breadcrumb-item v-else>
              <b style="color: #333">主页</b>
            </el-breadcrumb-item>
          </el-breadcrumb>

          <!-- ============ 页面 1：任务配置管理 ============ -->
          <div v-if="activeTab === 'task-config'" class="content-card">
            <!-- 筛选区 -->
            <div class="filter-bar">
              <span class="filter-label">活动名称</span>
              <el-input
                v-model="cfgFilter.activityName"
                placeholder="请输入活动名称"
                clearable
                style="width: 220px"
              />

              <span class="filter-label" style="margin-left: 8px">任务状态</span>
              <el-select
                v-model="cfgFilter.taskStatus"
                placeholder="全部"
                clearable
                style="width: 120px"
              >
                <el-option label="有效" value="valid" />
                <el-option label="无效" value="invalid" />
              </el-select>

              <el-button type="primary" class="filter-btn" @click="onCfgSearch">
                <el-icon style="margin-right: 4px"><Search /></el-icon>
                查询
              </el-button>
              <el-button class="filter-btn" @click="onCfgReset">
                <el-icon style="margin-right: 4px"><Refresh /></el-icon>
                重置
              </el-button>

              <div class="filter-spacer"></div>

              <el-button type="primary" class="filter-btn" @click="onCreateCfg">
                <el-icon style="margin-right: 4px"><Plus /></el-icon>
                新建任务配置
              </el-button>
            </div>

            <!-- 配置列表 -->
            <el-table
              :data="filteredCfgTable"
              stripe
              border
              size="default"
              style="width: 100%; margin-bottom: 16px"
              :row-class-name="tableRowClassName"
            >
              <el-table-column label="#" width="60" align="center">
                <template #default="{ $index }">{{ $index + 1 }}</template>
              </el-table-column>
              <el-table-column
                prop="taskId"
                label="任务ID"
                width="180"
                show-overflow-tooltip
              />
              <el-table-column
                prop="activityName"
                label="活动名称"
                min-width="190"
                show-overflow-tooltip
              />
              <el-table-column label="任务状态" width="90" align="center">
                <template #default="{ row }">
                  <el-tag
                    :type="taskCfgRow(row).taskStatus === 'valid' ? 'success' : 'info'"
                    effect="light"
                    size="small"
                  >{{ taskCfgRow(row).taskStatus === 'valid' ? '有效' : '无效' }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="任务周期" width="130">
                <template #default="{ row }">
                  <span v-if="taskCfgRow(row).cycleType === 'once'">一次性</span>
                  <span v-else>冷却周期 ({{ taskCfgRow(row).cooldownDays }}天)</span>
                </template>
              </el-table-column>
              <el-table-column label="任务目标" min-width="170">
                <template #default="{ row }">
                  <div>
                    <span>完单 {{ taskCfgRow(row).targetOrderCount }} 单</span>
                    <div v-if="taskCfgRow(row).hasDriverMetric" style="color:#8a8f98;font-size:12px">
                      + {{ metricLabel(taskCfgRow(row).metricType) }} ≥ {{ taskCfgRow(row).metricThreshold }}%
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="奖励类型" width="150">
                <template #default="{ row }">
                  <el-tag
                    v-if="taskCfgRow(row).rewardTypes.includes('normal')"
                    type="success" effect="light" size="small">普通奖品</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="更新时间" width="170" />
              <el-table-column label="操作" width="360" fixed="right">
                <template #default="{ row }">
                  <span class="action-link" @click="onViewCfg(row)">查看</span>
                  <span class="action-divider"></span>
                  <span
                    class="action-link"
                    @click="onEditCfg(row)"
                  >编辑</span>
                  <span class="action-divider"></span>
                  <span class="action-link" @click="onLogCfg(row)">日志</span>
                </template>
              </el-table-column>
            </el-table>

            <div class="pagination-row">
              <span class="pagination-total">共 {{ filteredCfgTable.length }} 条</span>
              <el-pagination
                v-model:current-page="cfgPage.current"
                v-model:page-size="cfgPage.size"
                :page-sizes="[10, 20, 50, 100]"
                layout="prev, pager, next, sizes"
                :total="filteredCfgTable.length"
                small
              />
              <span class="jump-label">前往</span>
              <el-input-number
                v-model="cfgPage.jump"
                :min="1"
                :max="Math.max(1, Math.ceil(filteredCfgTable.length / cfgPage.size))"
                size="small" controls-position="right"
                class="jump-input" style="width:72px"
              />
              <span class="jump-label">页</span>
            </div>
          </div>

          <!-- ============ 页面 2：任务参与记录 ============ -->
          <div v-else-if="activeTab === 'task-data'" class="content-card">
            <div class="filter-bar">
              <span class="filter-label">mid</span>
              <el-input
                v-model="dataFilter.driverId"
                placeholder="mid" clearable style="width:160px"
              />
              <span class="filter-label" style="margin-left:8px">任务ID</span>
              <el-input
                v-model="dataFilter.taskId"
                placeholder="taskId" clearable style="width:170px"
              />
              <span class="filter-label" style="margin-left:8px">用户任务状态</span>
              <el-select
                v-model="dataFilter.userTaskStatus"
                placeholder="全部" clearable style="width:120px"
              >
                <el-option label="进行中" value="progress" />
                <el-option label="待领取" value="claimable" />
                <el-option label="已领取" value="claimed" />
                <el-option label="已失效" value="expired" />
                <el-option label="冷却中" value="cooldown" />
              </el-select>
              <span class="filter-label" style="margin-left:8px">领取状态</span>
              <el-select
                v-model="dataFilter.claimStatus"
                placeholder="全部" clearable style="width:130px"
              >
                <el-option label="未领取" value="unclaimed" />
                <el-option label="领取成功" value="success" />
                <el-option label="部分失败" value="partial" />
                <el-option label="领取失败" value="fail" />
              </el-select>
            </div>
            <div class="filter-bar" style="margin-top: -8px">
              <el-button type="primary" class="filter-btn" @click="onDataSearch">
                <el-icon style="margin-right: 4px"><Search /></el-icon>查询
              </el-button>
              <el-button class="filter-btn" @click="onDataReset">
                <el-icon style="margin-right: 4px"><Refresh /></el-icon>重置
              </el-button>
            </div>

            <el-table
              :data="filteredDataTable"
              stripe border size="default"
              style="width: 100%; margin-bottom: 16px"
              :row-class-name="tableRowClassName"
            >
              <el-table-column label="#" width="60" align="center">
                <template #default="{ $index }">{{ $index + 1 }}</template>
              </el-table-column>
              <el-table-column prop="driverId" label="mid" width="120" show-overflow-tooltip />
              <el-table-column prop="taskId" label="任务ID" width="160" show-overflow-tooltip />
              <el-table-column
                prop="participationId" label="参与记录ID" width="190" show-overflow-tooltip
              />
              <el-table-column label="用户任务状态" width="100" align="center">
                <template #default="{ row }">
                  <el-tag
                    :type="userTaskStatusTagType(partRow(row).userTaskStatus)"
                    effect="light" size="small"
                  >{{ userTaskStatusLabel(partRow(row).userTaskStatus) }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="完单进度" min-width="180">
                <template #default="{ row }">
                  <div class="progress-cell">
                    <el-progress
                      :percentage="Math.round(partRow(row).completedOrderCount / partRow(row).targetOrderCount * 100)"
                      :stroke-width="8"
                      :color="partRow(row).completedOrderCount >= partRow(row).targetOrderCount ? '#52c41a' : '#1677ff'"
                    />
                    <span class="progress-text">{{ partRow(row).completedOrderCount }}/{{ partRow(row).targetOrderCount }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="领取状态" width="100" align="center">
                <template #default="{ row }">
                  <el-tag
                    :type="claimStatusTagType(partRow(row).claimStatus)"
                    effect="light" size="small"
                  >{{ claimStatusLabel(partRow(row).claimStatus) }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="90" fixed="right">
                <template #default="{ row }">
                  <span class="action-link" @click="onViewPart(row)">详情</span>
                </template>
              </el-table-column>
            </el-table>

            <div class="pagination-row">
              <span class="pagination-total">共 {{ filteredDataTable.length }} 条</span>
              <el-pagination
                v-model:current-page="dataPage.current"
                v-model:page-size="dataPage.size"
                :page-sizes="[10, 20, 50, 100]"
                layout="prev, pager, next, sizes"
                :total="filteredDataTable.length" small
              />
              <span class="jump-label">前往</span>
              <el-input-number
                v-model="dataPage.jump"
                :min="1"
                :max="Math.max(1, Math.ceil(filteredDataTable.length / dataPage.size))"
                size="small" controls-position="right"
                class="jump-input" style="width:72px"
              />
              <span class="jump-label">页</span>
            </div>
          </div>

          <!-- ============ 空占位页 ============ -->
          <div v-else class="content-card">
            <el-empty description="请选择菜单" />
          </div>

          <!-- Footer -->
          <el-footer
            style="
              height: auto;
              padding: 20px 0;
              text-align: center;
              color: #8a8f98;
              font-size: 12px;
              background: transparent;
            "
          >
            Copyright © 2002-2021 版权所有 同程网络科技股份有限公司
            Powered by 机票 - 创新营销系统组
          </el-footer>
        </div>
      </el-main>
    </el-container>

    <!-- ========== 弹窗 1：任务配置（新建/编辑/查看） ========== -->
    <el-dialog
      v-model="cfgDialog.visible"
      :title="cfgDialogTitle"
      width="860px"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      top="3vh"
    >
      <div v-if="cfgDialog.visible" style="max-height: 78vh; overflow-y: auto; padding-right: 6px">
        <!-- 5.1.1 任务基础配置（去除投放限制） -->
        <div class="form-section">
          <div class="form-section-title">
            任务基础配置
            <span class="sub-desc">活动名、任务状态、有效期等任务本体信息</span>
          </div>
          <el-form
            :model="cfgForm"
            :disabled="cfgDialog.mode === 'view'"
            label-width="130px" label-position="right"
          >
            <el-form-item label="活动名称" required>
              <el-input
                v-model="cfgForm.activityName"
                placeholder="仅用于后端呈现和配置识别，不直接作为前端展示文案"
                maxlength="64" show-word-limit
              />
            </el-form-item>
            <el-form-item label="任务状态" required>
              <el-radio-group v-model="cfgForm.taskStatus">
                <el-radio value="valid">有效</el-radio>
                <el-radio value="invalid">无效</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="任务有效期" required>
              <el-radio-group v-model="cfgForm.validityType">
                <el-radio value="fixed">固定时间生效</el-radio>
                <el-radio value="longterm">长期有效</el-radio>
              </el-radio-group>
            </el-form-item>
            <template v-if="cfgForm.validityType === 'fixed'">
              <el-form-item label="有效期开始时间" required>
                <el-date-picker
                  v-model="cfgForm.validStartTime" type="datetime"
                  placeholder="选择开始时间"
                  style="width: 240px"
                  value-format="YYYY-MM-DD HH:mm:ss"
                />
              </el-form-item>
              <el-form-item label="有效期结束时间" required>
                <el-date-picker
                  v-model="cfgForm.validEndTime" type="datetime"
                  placeholder="选择结束时间"
                  style="width: 240px"
                  value-format="YYYY-MM-DD HH:mm:ss"
                />
              </el-form-item>
            </template>
          </el-form>
        </div>

        <!-- 5.1.2 投放限制 -->
        <div class="form-section">
          <div class="form-section-title">
            投放限制
            <span class="sub-desc">按司机接单数量、会员卡、司机标签、先知人群、AB实验过滤投放命中</span>
          </div>
          <el-form
            :model="cfgForm"
            :disabled="cfgDialog.mode === 'view'"
            label-width="160px" label-position="right"
          >
            <el-form-item label="启用司机接单数量限制">
              <el-switch v-model="cfgForm.enableOrderLimit" />
            </el-form-item>
            <el-form-item v-if="cfgForm.enableOrderLimit" label="最小接单数量" required>
              <el-input-number
                v-model="cfgForm.minOrderCount"
                :min="1"
                :max="9999"
                :step="1"
                placeholder="司机接单数量需大于等于此值"
                style="width:100%"
              />
              <span style="color:#8a8f98;font-size:12px;margin-left:8px">仅接单数量大于等于此值的司机可参与任务</span>
            </el-form-item>
            <el-form-item label="启用会员卡限制">
              <el-switch v-model="cfgForm.enableMemberCardLimit" />
            </el-form-item>
            <el-form-item v-if="cfgForm.enableMemberCardLimit" label="会员卡条件" required>
              <el-select
                v-model="cfgForm.memberCardCondition"
                placeholder="选择会员卡条件"
                style="width:100%"
              >
                <el-option label="无赠送会员卡" value="no_gift" />
                <el-option label="无购买会员卡" value="no_purchase" />
                <el-option label="无赠送/购买会员卡" value="no_both" />
              </el-select>
            </el-form-item>
            <el-form-item label="启用司机标签限制">
              <el-switch v-model="cfgForm.enableDriverTags" />
            </el-form-item>
            <el-form-item v-if="cfgForm.enableDriverTags" label="司机标签" required>
              <el-select
                v-model="cfgForm.driverTags"
                multiple
                filterable
                placeholder="选择司机标签（支持多选）"
                style="width:100%"
              >
                <el-option label="工号司机" value="staff_driver" />
                <el-option label="加盟司机" value="franchise_driver" />
                <el-option label="新手司机" value="new_driver" />
                <el-option label="高活跃司机" value="high_active" />
                <el-option label="低活跃司机" value="low_active" />
              </el-select>
            </el-form-item>
            <el-form-item label="启用先知人群限制">
              <el-switch v-model="cfgForm.enableCrowdLimit" />
            </el-form-item>
            <el-form-item v-if="cfgForm.enableCrowdLimit" label="先知人群" required>
              <el-select
                v-model="cfgForm.crowdCodes"
                multiple
                filterable
                placeholder="选择先知人群（支持多选）"
                style="width:100%"
              >
                <el-option label="高活跃司机" value="high_active_driver" />
                <el-option label="低活跃司机" value="low_active_driver" />
                <el-option label="新注册司机" value="new_register_driver" />
                <el-option label="回归司机" value="return_driver" />
                <el-option label="高完单率司机" value="high_finish_rate" />
                <el-option label="低完单率司机" value="low_finish_rate" />
              </el-select>
            </el-form-item>
            <el-form-item label="启用AB实验限制">
              <el-switch v-model="cfgForm.enableAbLimit" />
            </el-form-item>
            <template v-if="cfgForm.enableAbLimit">
              <el-form-item label="AB实验ID" required>
                <el-input
                  v-model="cfgForm.abExpId"
                  placeholder="输入AB实验ID"
                  maxlength="64" show-word-limit
                />
              </el-form-item>
              <el-form-item label="AB实验分组" required>
                <el-select
                  v-model="cfgForm.abGroups"
                  multiple
                  filterable
                  placeholder="选择AB实验分组（支持多选）"
                  style="width:100%"
                >
                  <el-option label="对照组（A组）" value="group_a" />
                  <el-option label="实验组1（B组）" value="group_b" />
                  <el-option label="实验组2（C组）" value="group_c" />
                  <el-option label="实验组3（D组）" value="group_d" />
                </el-select>
              </el-form-item>
            </template>
          </el-form>
        </div>

        <!-- 5.1.3 任务配置（保持） -->
        <div class="form-section">
          <div class="form-section-title">
            任务配置
            <span class="sub-desc">设置任务周期、目标与指标判定</span>
          </div>
          <el-form
            :model="cfgForm"
            :disabled="cfgDialog.mode === 'view'"
            label-width="150px" label-position="right"
          >
            <el-form-item label="任务周期" required>
              <el-radio-group v-model="cfgForm.cycleType">
                <el-radio value="once">一次性任务</el-radio>
                <el-radio value="cycle">冷却周期型任务</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="cfgForm.cycleType === 'cycle'" label="冷却天数" required>
              <el-input-number
                v-model="cfgForm.cooldownDays" :min="1" :max="365" controls-position="right"
              />
              <div style="color:#8a8f98;font-size:12px;margin-top:4px">
                领取奖励后多少天可以再次开始下一轮任务
              </div>
            </el-form-item>
            <el-form-item label="任务类型" required>
              <el-select v-model="cfgForm.taskType" style="width:200px">
                <el-option label="完单任务" value="finish_order" />
              </el-select>
            </el-form-item>
            <el-form-item label="完成订单数" required>
              <el-input-number
                v-model="cfgForm.targetOrderCount"
                :min="1" :max="9999" controls-position="right"
              />
            </el-form-item>
            <el-form-item label="是否关联司机指标" required>
              <el-switch v-model="cfgForm.hasDriverMetric" />
            </el-form-item>
            <template v-if="cfgForm.hasDriverMetric">
              <el-form-item label="指标类型" required>
                <el-select v-model="cfgForm.metricType" style="width:200px">
                  <el-option label="接完率" value="finish_rate" />
                  <el-option label="接单率" value="accept_rate" />
                  <el-option label="服务评分" value="service_score" />
                </el-select>
              </el-form-item>
              <el-form-item label="指标数值限制" required>
                <el-input-number
                  v-model="cfgForm.metricThreshold"
                  :min="0" :max="100" :precision="2" :step="0.5" controls-position="right"
                />
                <span style="margin-left:8px;color:#606266">%</span>
                <div style="color:#8a8f98;font-size:12px;margin-top:4px">
                  判定规则：实时指标 ≥ 阈值 视为达标
                </div>
              </el-form-item>
            </template>
          </el-form>
        </div>

        <!-- 5.1.4 奖励配置（保持） -->
        <div class="form-section">
          <div class="form-section-title">
            奖励配置
            <span class="sub-desc">至少配置一种奖励（可多选）</span>
          </div>
          <el-form
            :model="cfgForm"
            :disabled="cfgDialog.mode === 'view'"
            label-width="150px" label-position="right"
          >
            <el-form-item label="奖励类型" required>
              <el-checkbox-group v-model="cfgForm.rewardTypes">
                <el-checkbox value="normal">普通奖品（营销平台领取工具）</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item
              v-if="cfgForm.rewardTypes.includes('normal')"
              label="普通奖励领取code" required
            >
              <el-input
                v-model="cfgForm.normalRewardCode"
                placeholder="关联营销平台普通奖励领取 code"
              />
            </el-form-item>
          </el-form>
        </div>

        <!-- 5.1.5 前端样式配置（保持） -->
        <div class="form-section">
          <div class="form-section-title">
            前端样式配置
            <span class="sub-desc">司机端真车主任务中心的任务卡片文案</span>
          </div>
          <el-form
            :model="cfgForm"
            :disabled="cfgDialog.mode === 'view'"
            label-width="130px" label-position="right"
          >
            <el-form-item label="任务标题" required>
              <el-input
                v-model="cfgForm.taskTitle"
                placeholder="用于前端展示的任务标题"
                maxlength="40" show-word-limit
              />
            </el-form-item>
            <el-form-item label="任务icon">
              <el-upload
                v-model:file-list="taskIconFileList"
                action=""
                list-type="picture-card"
                :auto-upload="false"
                :limit="1"
                :multiple="false"
                accept="image/*"
                :on-change="onTaskIconChange"
                :on-remove="onTaskIconRemove"
                :on-exceed="onTaskIconExceed"
              >
                <el-icon><Plus /></el-icon>
              </el-upload>
              <div style="color:#8a8f98;font-size:12px;margin-top:4px">选填；仅允许上传一张图片，建议尺寸 120×120，JPG/PNG 格式</div>
            </el-form-item>
            <el-form-item label="任务角标">
              <el-input
                v-model="cfgForm.taskBadge"
                placeholder="如：新人专享、限时、热门（选填）"
                maxlength="10" show-word-limit
              />
            </el-form-item>
            <el-form-item label="任务副标题">
              <el-input
                v-model="cfgForm.taskSubtitle"
                placeholder="用于前端呈现（选填）"
                maxlength="60" show-word-limit
              />
            </el-form-item>
            <el-form-item label="奖励名称">
              <el-input
                v-model="cfgForm.rewardDesc"
                placeholder="请输入奖励名称（选填，用于前端展示）"
                maxlength="200" show-word-limit
              />
            </el-form-item>
            <el-form-item label="任务说明">
              <el-input
                v-model="cfgForm.taskDesc" type="textarea" :rows="3"
                placeholder="前端展示任务规则说明（选填）"
                maxlength="200" show-word-limit
              />
            </el-form-item>
          </el-form>
        </div>
      </div>

      <template #footer>
        <el-button @click="cfgDialog.visible = false">
          {{ cfgDialog.mode === 'view' ? '关闭' : '取消' }}
        </el-button>
        <template v-if="cfgDialog.mode !== 'view'">
          <el-button @click="onSaveCfgDraft">保存草稿</el-button>
          <el-button type="primary" @click="onSubmitCfg">
            {{ cfgDialog.mode === 'create' ? '提交创建' : '提交修改' }}
          </el-button>
        </template>
      </template>
    </el-dialog>

    <!-- Drawer：任务参与记录详情 -->
    <el-drawer
      v-model="partDrawer.visible"
      title="任务参与记录详情"
      size="580px"
    >
      <div v-if="partDrawer.visible && partDrawer.data" style="font-size:14px">
        <el-descriptions :column="1" border size="default">
          <el-descriptions-item label="mid">
            {{ partRow(partDrawer.data).driverId }}
          </el-descriptions-item>
          <el-descriptions-item label="任务ID">
            {{ partRow(partDrawer.data).taskId }}
          </el-descriptions-item>
          <el-descriptions-item label="参与记录ID">
            {{ partRow(partDrawer.data).participationId }}
          </el-descriptions-item>
          <el-descriptions-item label="任务标题">
            {{ partRow(partDrawer.data).taskTitle }}
          </el-descriptions-item>
          <el-descriptions-item label="用户任务状态">
            <el-tag
              :type="userTaskStatusTagType(partRow(partDrawer.data).userTaskStatus)"
              size="small">
              {{ userTaskStatusLabel(partRow(partDrawer.data).userTaskStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="完单进度">
            {{ partRow(partDrawer.data).completedOrderCount }} / {{ partRow(partDrawer.data).targetOrderCount }}
          </el-descriptions-item>
          <el-descriptions-item
            v-if="partRow(partDrawer.data).hasDriverMetric"
            label="司机指标"
          >
            <span :style="{
              color: partRow(partDrawer.data).driverMetricValue >= partRow(partDrawer.data).metricThreshold
                ? '#52c41a' : '#f5222d'
            }">
              {{ metricLabel(partRow(partDrawer.data).metricType) }} {{ partRow(partDrawer.data).driverMetricValue }}%
              （阈值 ≥ {{ partRow(partDrawer.data).metricThreshold }}%）
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="领取状态">
            <el-tag
              :type="claimStatusTagType(partRow(partDrawer.data).claimStatus)"
              size="small">
              {{ claimStatusLabel(partRow(partDrawer.data).claimStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="周期开始时间">
            {{ partRow(partDrawer.data).cycleStartTime }}
          </el-descriptions-item>
          <el-descriptions-item v-if="partRow(partDrawer.data).claimTime" label="领取时间">
            {{ partRow(partDrawer.data).claimTime }}
          </el-descriptions-item>
        </el-descriptions>

        <!-- 奖励信息：每种奖励单独卡片呈现 -->
        <div v-if="partRow(partDrawer.data).rewardTypes.length" style="margin-top: 24px">
          <div style="display:flex;align-items:center;margin-bottom:12px;font-weight:600;color:#333;font-size:15px">
            <span style="width:3px;height:14px;background:#1677ff;margin-right:8px;display:inline-block;border-radius:2px"></span>
            奖励信息
          </div>
          <div style="display:flex;flex-direction:column;gap:12px">
            <div
              v-if="partRow(partDrawer.data).rewardTypes.includes('normal')"
              style="border:1px solid #c7e8b7;border-radius:8px;padding:16px 20px;background:#f6ffed">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
                <el-tag type="success" effect="light">普通奖品</el-tag>
                <el-tag
                  :type="
                    partRow(partDrawer.data).prizeResult === 'success' ? 'success'
                      : partRow(partDrawer.data).prizeResult === 'fail' ? 'danger' : 'info'
                  "
                  size="small"
                >发放结果：{{ issueLabel(partRow(partDrawer.data).prizeResult) }}</el-tag>
              </div>
              <div style="font-size:13px;color:#595959">
                <span style="color:#8a8f98">奖励 Code：</span>
                <code>{{ partRow(partDrawer.data).prizeRewardCode || 'PRIZE_TASK_0001' }}</code>
              </div>
              <div
                v-if="partRow(partDrawer.data).prizeResult === 'fail'"
                style="margin-top:14px;display:flex;justify-content:flex-end"
              >
                <el-button size="small" type="success" plain @click="onRetryIssueByType()">
                  <el-icon style="margin-right:4px"><Refresh /></el-icon>重试奖品发放
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </el-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

/* ================ 公共类型 ================ */
interface TabItem { key: string; label: string; closable?: boolean }
type ConfigStatus = 'pending' | 'published' | 'offline'
type TaskStatus = 'valid' | 'invalid'
type CycleType = 'once' | 'cycle'
type MetricType = 'finish_rate' | 'accept_rate' | 'service_score'

/* ------- 任务配置 ------- */
interface TaskCfgRow {
  key: string
  taskId: string
  activityName: string
  taskStatus: TaskStatus
  configStatus: ConfigStatus
  validityType: 'fixed' | 'longterm'
  validStartTime: string
  validEndTime: string
  enableOrderLimit: boolean
  minOrderCount: number
  enableMemberCardLimit: boolean
  memberCardCondition: 'no_gift' | 'no_purchase' | 'no_both'
  enableDriverTags: boolean
  driverTags: string[]
  enableCrowdLimit: boolean
  crowdCodes: string[]
  enableAbLimit: boolean
  abExpId: string
  abGroups: string[]
  cycleType: CycleType
  cooldownDays: number
  taskType: 'finish_order'
  targetOrderCount: number
  hasDriverMetric: boolean
  metricType: MetricType
  metricThreshold: number
  rewardTypes: 'normal'[]
  normalRewardCode: string
  taskTitle: string
  taskSubtitle: string
  taskDesc: string
  rewardDesc: string
  taskIcon: string
  taskBadge: string
  createTime: string
}

/* ------- 参与记录 ------- */
type UserTaskStatus = 'progress' | 'claimable' | 'claimed' | 'expired' | 'cooldown'
type ClaimStatus = 'unclaimed' | 'success' | 'partial' | 'fail'
type IssueResult = 'none' | 'success' | 'fail'
interface PartRow {
  key: string
  driverId: string
  deliveryTaskRelationId: string
  taskId: string
  participationId: string
  taskTitle: string
  userTaskStatus: UserTaskStatus
  completedOrderCount: number
  targetOrderCount: number
  hasDriverMetric: boolean
  metricType: MetricType
  metricThreshold: number
  driverMetricValue: number
  claimStatus: ClaimStatus
  rewardTypes: 'normal'[]
  prizeResult: IssueResult
  prizeRewardCode?: string
  cycleStartTime: string
  claimTime?: string
}

/* ================ 顶部 & 菜单 ================ */
const collapsed = ref(false)
const topActive = ref('ao')
const topSearch = ref('真车主任务')

const activeMenu = ref('task-config')
const activeTab = ref('task-config')
const tabs = ref<TabItem[]>([
  { key: 'home', label: '主页', closable: false },
  { key: 'task-config', label: '任务配置管理', closable: true },
  { key: 'task-data', label: '任务参与记录', closable: true },
])

function removeTab(targetKey: string) {
  const idx = tabs.value.findIndex((t) => t.key === targetKey)
  if (idx < 0) return
  tabs.value.splice(idx, 1)
  if (activeTab.value === targetKey && tabs.value.length) {
    activeTab.value = tabs.value[tabs.value.length - 1].key
  }
}
function onMenuSelect(key: string) {
  activeMenu.value = key
  const knownMap: Record<string, string> = {
    'task-config': '任务配置管理',
    'task-data': '任务参与记录',
  }
  if (!tabs.value.some((t) => t.key === key)) {
    tabs.value.push({ key, label: knownMap[key] || key, closable: true })
  }
  activeTab.value = key
}

/* ================ 通用 Label / Tag 类型 ================ */
function metricLabel(m: MetricType) {
  return m === 'finish_rate' ? '接完率' : m === 'accept_rate' ? '接单率' : '服务评分'
}
function userTaskStatusLabel(s: UserTaskStatus) {
  return ({ progress:'进行中', claimable:'待领取', claimed:'已领取', expired:'已失效', cooldown:'冷却中' } as const)[s]
}
function userTaskStatusTagType(s: UserTaskStatus) {
  return ({ progress:'primary', claimable:'warning', claimed:'success', expired:'info', cooldown:'info' } as const)[s]
}
function claimStatusLabel(s: ClaimStatus) {
  return ({ unclaimed:'未领取', success:'领取成功', partial:'部分失败', fail:'领取失败' } as const)[s]
}
function claimStatusTagType(s: ClaimStatus) {
  return ({ unclaimed:'info', success:'success', partial:'warning', fail:'danger' } as const)[s]
}
function issueLabel(r: IssueResult) {
  return r === 'success' ? '已发放' : r === 'fail' ? '发放失败' : '未发起'
}
function tableRowClassName({ rowIndex }: { rowIndex: number }) {
  return rowIndex % 2 === 1 ? 'row-alt' : ''
}

/* ====================================================== */
/* ========== 页面 1：任务配置管理 ========== */
/* ====================================================== */

const cfgFilter = reactive({
  activityName: '',
  taskStatus: undefined as TaskStatus | undefined,
})
const appliedCfgFilter = reactive({ ...cfgFilter })
const cfgPage = reactive({ current: 1, size: 10, jump: 1 })

/* 类型收口：Element Plus slot row 是 DefaultRow (object)，统一断言 */
function taskCfgRow(row: unknown): TaskCfgRow { return row as TaskCfgRow }

const cfgTable = ref<TaskCfgRow[]>([
  {
    key: '1', taskId: 'TASK202607090001',
    activityName: 'Q3高活跃司机完单激励',
    taskStatus: 'valid',
    configStatus: 'published',
    validityType: 'fixed',
    validStartTime: '2026-07-01 00:00:00', validEndTime: '2026-09-30 23:59:59',
    enableOrderLimit: true, minOrderCount: 100,
    enableMemberCardLimit: false, memberCardCondition: 'no_both',
    enableDriverTags: true, driverTags: ['high_active'],
    enableCrowdLimit: true, crowdCodes: ['high_active_driver'],
    enableAbLimit: false, abExpId: '', abGroups: [],
    cycleType: 'cycle', cooldownDays: 7,
    taskType: 'finish_order', targetOrderCount: 30,
    hasDriverMetric: true, metricType: 'finish_rate', metricThreshold: 75,
    rewardTypes: ['normal'],
    normalRewardCode: 'PRIZE_TASK_0001',
    taskTitle: '本周完成30单，领取奖励',
    taskSubtitle: '接完率≥75%',
    taskDesc: '每周累计完成30个订单且周内接完率≥75%即可领取奖励。',
    rewardDesc: '满足条件可领取价值 18 元的券包奖励。',
    taskIcon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=%E7%BA%A2%E8%89%B2%E7%8E%B0%E9%87%91%E7%BA%A2%E5%8C%85%E9%87%91%E5%B8%81%E5%9B%BE%E6%A0%87%20%E7%BD%91%E7%BA%A6%E8%BD%A6%E5%8F%B8%E6%9C%BA%E4%BB%BB%E5%8A%A1%E5%A5%96%E5%8A%B1%20%E7%AE%80%E7%BA%A6%E6%89%81%E5%B9%B3%E9%A3%8E%E6%A0%BC&image_size=square_hd',
    taskBadge: '限时冲刺',
    createTime: '2026-07-01 10:23:45',
  },
  {
    key: '2', taskId: 'TASK202607090002',
    activityName: '新司机首月完单20单领券包',
    taskStatus: 'valid',
    configStatus: 'published',
    validityType: 'longterm', validStartTime: '', validEndTime: '',
    enableOrderLimit: false, minOrderCount: 0,
    enableMemberCardLimit: true, memberCardCondition: 'no_both',
    enableDriverTags: true, driverTags: ['new_driver'],
    enableCrowdLimit: true, crowdCodes: ['new_register_driver'],
    enableAbLimit: false, abExpId: '', abGroups: [],
    cycleType: 'once', cooldownDays: 0,
    taskType: 'finish_order', targetOrderCount: 20,
    hasDriverMetric: false, metricType: 'finish_rate', metricThreshold: 0,
    rewardTypes: ['normal'],
    normalRewardCode: 'PRIZE_NEWDRIVER_002',
    taskTitle: '新人首月完成20单，领取超值券包',
    taskSubtitle: '',
    taskDesc: '新人首月累计完成20单即可领取券包。',
    rewardDesc: '奖品总价值 36 元，含 1 张加油券 + 2 张洗车券，领后 15 天有效。',
    taskIcon: '',
    taskBadge: '新人专享',
    createTime: '2026-07-02 14:11:02',
  },
  {
    key: '3', taskId: 'TASK202607090003',
    activityName: '低完单率司机每日接单率提升任务',
    taskStatus: 'valid',
    configStatus: 'published',
    validityType: 'fixed',
    validStartTime: '2026-07-15 00:00:00', validEndTime: '2026-10-15 23:59:59',
    enableOrderLimit: false, minOrderCount: 0,
    enableMemberCardLimit: false, memberCardCondition: 'no_both',
    enableDriverTags: true, driverTags: ['low_active'],
    enableCrowdLimit: true, crowdCodes: ['low_finish_rate'],
    enableAbLimit: false, abExpId: '', abGroups: [],
    cycleType: 'cycle', cooldownDays: 1,
    taskType: 'finish_order', targetOrderCount: 15,
    hasDriverMetric: true, metricType: 'accept_rate', metricThreshold: 60,
    rewardTypes: ['normal'],
    normalRewardCode: 'PRIZE_TASK_0003',
    taskTitle: '每日完成15单 + 接单率≥60% 领奖励',
    taskSubtitle: '',
    taskDesc: '每日完成15单并保持接单率≥60%可领取奖励。',
    rewardDesc: '价值 15 元券包 1 份；券包实时发放。',
    taskIcon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=%E7%BB%BF%E8%89%B2%E6%B1%BD%E8%BD%A6%E8%BD%A6%E9%80%9F%E8%A1%A8%E7%AE%AD%E5%A4%B4%E5%90%91%E4%B8%8A%20%E6%8E%A5%E5%8D%95%E7%8E%87%E6%8F%90%E5%8D%87%E5%9B%BE%E6%A0%87%20%E7%AE%80%E7%BA%A6%E6%89%81%E5%B9%B3%E7%99%BD%E5%BA%95&image_size=square_hd',
    taskBadge: '每日必做',
    createTime: '2026-07-08 09:40:11',
  },
  {
    key: '4', taskId: 'TASK202607090004',
    activityName: '召回司机专属-完单10单领奖励',
    taskStatus: 'valid',
    configStatus: 'pending',
    validityType: 'fixed',
    validStartTime: '2026-07-20 00:00:00', validEndTime: '2026-09-30 23:59:59',
    enableOrderLimit: false, minOrderCount: 0,
    enableMemberCardLimit: false, memberCardCondition: 'no_both',
    enableDriverTags: false, driverTags: [],
    enableCrowdLimit: true, crowdCodes: ['return_driver'],
    enableAbLimit: false, abExpId: '', abGroups: [],
    cycleType: 'once', cooldownDays: 0,
    taskType: 'finish_order', targetOrderCount: 10,
    hasDriverMetric: true, metricType: 'finish_rate', metricThreshold: 70,
    rewardTypes: ['normal'],
    normalRewardCode: 'PRIZE_CALLBACK_004',
    taskTitle: '回归专属：完成10单领奖励',
    taskSubtitle: '接完率≥70%',
    taskDesc: '召回司机专属，完成10单且接完率≥70%可领奖励。',
    rewardDesc: '价值 20 元的券包奖励，仅限一次。',
    taskIcon: '',
    taskBadge: '回归专属',
    createTime: '2026-07-08 16:05:20',
  },
  {
    key: '5', taskId: 'TASK202607090005',
    activityName: '核心城市暑期司机冲刺任务',
    taskStatus: 'invalid',
    configStatus: 'published',
    validityType: 'fixed',
    validStartTime: '2026-06-15 00:00:00', validEndTime: '2026-08-31 23:59:59',
    enableOrderLimit: true, minOrderCount: 200,
    enableMemberCardLimit: false, memberCardCondition: 'no_both',
    enableDriverTags: false, driverTags: [],
    enableCrowdLimit: false, crowdCodes: [],
    enableAbLimit: true, abExpId: 'AB_EXP_001', abGroups: ['group_a', 'group_b'],
    cycleType: 'cycle', cooldownDays: 36,
    taskType: 'finish_order', targetOrderCount: 50,
    hasDriverMetric: true, metricType: 'finish_rate', metricThreshold: 80,
    rewardTypes: ['normal'],
    normalRewardCode: 'PRIZE_SPRINT_005',
    taskTitle: '暑期冲刺50单+接完率80%领大奖',
    taskSubtitle: '',
    taskDesc: '每周期3天，50单+接完率≥80%可得实物奖品。',
    rewardDesc: '奖励：定制行李箱贴纸套装；以实物发货为准。',
    taskIcon: '',
    taskBadge: '',
    createTime: '2026-06-15 11:30:00',
  },
  {
    key: '6', taskId: 'TASK202607090006',
    activityName: '月度服务之星-评分达标奖励',
    taskStatus: 'valid',
    configStatus: 'published',
    validityType: 'longterm', validStartTime: '', validEndTime: '',
    enableOrderLimit: false, minOrderCount: 0,
    enableMemberCardLimit: false, memberCardCondition: 'no_both',
    enableDriverTags: true, driverTags: ['staff_driver'],
    enableCrowdLimit: false, crowdCodes: [],
    enableAbLimit: false, abExpId: '', abGroups: [],
    cycleType: 'cycle', cooldownDays: 30,
    taskType: 'finish_order', targetOrderCount: 100,
    hasDriverMetric: true, metricType: 'service_score', metricThreshold: 95,
    rewardTypes: ['normal'],
    normalRewardCode: 'PRIZE_STAR_006',
    taskTitle: '月度服务之星·评分达标赢好礼',
    taskSubtitle: '服务评分≥95分',
    taskDesc: '月度完成100单且服务评分≥95即可领取奖品。',
    rewardDesc: '专属"服务之星"电子徽章 + 50 元油卡券包，次月 5 日前统一发放。',
    taskIcon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=%E9%87%91%E8%89%B2%E4%BA%94%E8%A7%92%E6%98%9F%E5%A5%96%E7%AB%A0%E4%B8%9D%E5%B8%A6%20%E6%9C%8D%E5%8A%A1%E4%B9%8B%E6%98%9F%E8%8D%A3%E8%AA%89%E5%9B%BE%E6%A0%87%20%E7%AE%80%E7%BA%A6%E6%89%81%E5%B9%B3%E7%99%BD%E5%BA%95&image_size=square_hd',
    taskBadge: '专属荣誉',
    createTime: '2026-07-05 08:20:15',
  },
  {
    key: '7', taskId: 'TASK20260710007',
    activityName: '每日完单5单-基础任务',
    taskStatus: 'valid',
    configStatus: 'published',
    validityType: 'longterm', validStartTime: '', validEndTime: '',
    enableOrderLimit: false, minOrderCount: 0,
    enableMemberCardLimit: false, memberCardCondition: 'no_both',
    enableDriverTags: false, driverTags: [],
    enableCrowdLimit: false, crowdCodes: [],
    enableAbLimit: false, abExpId: '', abGroups: [],
    cycleType: 'cycle', cooldownDays: 1,
    taskType: 'finish_order', targetOrderCount: 5,
    hasDriverMetric: false, metricType: 'finish_rate', metricThreshold: 0,
    rewardTypes: ['normal'],
    normalRewardCode: 'PRIZE_DAILY_007',
    taskTitle: '每日完成5单领基础奖励',
    taskSubtitle: '轻松每日达成',
    taskDesc: '每日完成5单即可领取基础奖励。',
    rewardDesc: '领取即可获得 3 元停车券或洗车券，当日有效。',
    taskIcon: '',
    taskBadge: '每日基础',
    createTime: '2026-07-09 20:00:00',
  },
  {
    key: '8', taskId: 'TASK20260710008',
    activityName: '低活司机专项激活任务',
    taskStatus: 'valid',
    configStatus: 'published',
    validityType: 'fixed',
    validStartTime: '2026-07-10 00:00:00', validEndTime: '2026-12-31 23:59:59',
    enableOrderLimit: false, minOrderCount: 0,
    enableMemberCardLimit: true, memberCardCondition: 'no_gift',
    enableDriverTags: false, driverTags: [],
    enableCrowdLimit: true, crowdCodes: ['low_active_driver'],
    enableAbLimit: false, abExpId: '', abGroups: [],
    cycleType: 'once', cooldownDays: 0,
    taskType: 'finish_order', targetOrderCount: 3,
    hasDriverMetric: false, metricType: 'finish_rate', metricThreshold: 0,
    rewardTypes: ['normal'],
    normalRewardCode: 'PRIZE_LOWACT_008',
    taskTitle: '完成3单激活奖励',
    taskSubtitle: '低活司机专属',
    taskDesc: '3单即可领取激活奖励。',
    rewardDesc: '激活奖励：价值 12 元的券包。',
    taskIcon: '',
    taskBadge: '专属激活',
    createTime: '2026-07-10 09:30:00',
  },
])

const filteredCfgTable = computed<TaskCfgRow[]>(() => {
  return cfgTable.value.filter((row) => {
    if (appliedCfgFilter.activityName
      && !row.activityName.includes(appliedCfgFilter.activityName)) return false
    if (appliedCfgFilter.taskStatus
      && row.taskStatus !== appliedCfgFilter.taskStatus) return false
    return true
  })
})

/* ------- 任务配置弹窗 ------- */
type DialogMode = 'create' | 'edit' | 'view'
const cfgDialog = reactive({
  visible: false,
  mode: 'create' as DialogMode,
  editingKey: '' as string,
})
const cfgDialogTitle = computed(() => ({
  create: '新建任务配置', edit: '编辑任务配置', view: '查看任务配置详情',
} as const)[cfgDialog.mode])

interface CfgForm {
  activityName: string
  taskStatus: TaskStatus
  configStatus: ConfigStatus
  validityType: 'fixed' | 'longterm'
  validStartTime: string
  validEndTime: string
  enableOrderLimit: boolean
  minOrderCount: number
  enableMemberCardLimit: boolean
  memberCardCondition: 'no_gift' | 'no_purchase' | 'no_both'
  enableDriverTags: boolean
  driverTags: string[]
  enableCrowdLimit: boolean
  crowdCodes: string[]
  enableAbLimit: boolean
  abExpId: string
  abGroups: string[]
  cycleType: CycleType
  cooldownDays: number
  taskType: 'finish_order'
  targetOrderCount: number
  hasDriverMetric: boolean
  metricType: MetricType
  metricThreshold: number
  rewardTypes: 'normal'[]
  normalRewardCode: string
  taskTitle: string
  taskSubtitle: string
  taskDesc: string
  rewardDesc: string
  taskIcon: string
  taskBadge: string
}
const cfgForm = reactive<CfgForm>({
  activityName: '', taskStatus: 'valid', configStatus: 'published',
  validityType: 'fixed', validStartTime: '', validEndTime: '',
  enableOrderLimit: false, minOrderCount: 0,
  enableMemberCardLimit: false, memberCardCondition: 'no_both',
  enableDriverTags: false, driverTags: [],
  enableCrowdLimit: false, crowdCodes: [],
  enableAbLimit: false, abExpId: '', abGroups: [],
  cycleType: 'once', cooldownDays: 7,
  taskType: 'finish_order', targetOrderCount: 10,
  hasDriverMetric: true, metricType: 'finish_rate', metricThreshold: 75,
  rewardTypes: ['normal'],
  normalRewardCode: '',
  taskTitle: '', taskSubtitle: '', taskDesc: '', rewardDesc: '',
  taskIcon: '', taskBadge: '',
})

function resetCfgForm() {
  Object.assign(cfgForm, {
    activityName: '', taskStatus: 'valid', configStatus: 'published',
    validityType: 'fixed', validStartTime: '', validEndTime: '',
    enableOrderLimit: false, minOrderCount: 0,
    enableMemberCardLimit: false, memberCardCondition: 'no_both',
    enableDriverTags: false, driverTags: [],
    enableCrowdLimit: false, crowdCodes: [],
    enableAbLimit: false, abExpId: '', abGroups: [],
    cycleType: 'once', cooldownDays: 7,
    taskType: 'finish_order', targetOrderCount: 10,
    hasDriverMetric: true, metricType: 'finish_rate', metricThreshold: 75,
    rewardTypes: ['normal'],
    normalRewardCode: '',
    taskTitle: '', taskSubtitle: '', taskDesc: '', rewardDesc: '',
    taskIcon: '', taskBadge: '',
  } as CfgForm)
  taskIconFileList.value = []
}
function fillCfgFormFromRow(row: TaskCfgRow) {
  Object.assign(cfgForm, {
    activityName: row.activityName,
    taskStatus: row.taskStatus,
    configStatus: row.configStatus,
    validityType: row.validityType,
    validStartTime: row.validStartTime,
    validEndTime: row.validEndTime,
    enableOrderLimit: row.enableOrderLimit,
    minOrderCount: row.minOrderCount,
    enableMemberCardLimit: row.enableMemberCardLimit,
    memberCardCondition: row.memberCardCondition,
    enableDriverTags: row.enableDriverTags,
    driverTags: [...row.driverTags],
    enableCrowdLimit: row.enableCrowdLimit,
    crowdCodes: [...row.crowdCodes],
    enableAbLimit: row.enableAbLimit,
    abExpId: row.abExpId,
    abGroups: [...row.abGroups],
    cycleType: row.cycleType,
    cooldownDays: row.cooldownDays,
    taskType: row.taskType,
    targetOrderCount: row.targetOrderCount,
    hasDriverMetric: row.hasDriverMetric,
    metricType: row.metricType,
    metricThreshold: row.metricThreshold,
    rewardTypes: [...row.rewardTypes],
    normalRewardCode: row.normalRewardCode,
    taskTitle: row.taskTitle,
    taskSubtitle: row.taskSubtitle,
    taskDesc: row.taskDesc,
    rewardDesc: row.rewardDesc,
    taskIcon: row.taskIcon,
    taskBadge: row.taskBadge,
  } as CfgForm)
  if (row.taskIcon) {
    taskIconFileList.value = [{ name: 'taskIcon.png', url: row.taskIcon } as any]
  } else {
    taskIconFileList.value = []
  }
}

function validateCfg(draft: boolean) {
  if (!draft) {
    if (!cfgForm.activityName.trim()) { ElMessage.warning('请填写活动名称'); return false }
    if (cfgForm.validityType === 'fixed') {
      if (!cfgForm.validStartTime || !cfgForm.validEndTime) { ElMessage.warning('请选择有效期起止时间'); return false }
      if (cfgForm.validStartTime >= cfgForm.validEndTime) { ElMessage.warning('有效期开始时间需早于结束时间'); return false }
    }
    if (cfgForm.cycleType === 'cycle' && (!cfgForm.cooldownDays || cfgForm.cooldownDays <= 0)) {
      ElMessage.warning('冷却周期型任务请设置冷却天数'); return false
    }
    if (!cfgForm.targetOrderCount || cfgForm.targetOrderCount <= 0) {
      ElMessage.warning('请设置完成订单数'); return false
    }
    if (cfgForm.hasDriverMetric && cfgForm.metricThreshold < 0) {
      ElMessage.warning('请设置指标阈值'); return false
    }
    if (cfgForm.rewardTypes.length === 0) { ElMessage.warning('请至少选择一种奖励类型'); return false }
    if (cfgForm.rewardTypes.includes('normal') && !cfgForm.normalRewardCode.trim()) {
      ElMessage.warning('请填写普通奖励领取 code'); return false
    }
    if (!cfgForm.taskTitle.trim()) { ElMessage.warning('请填写任务标题（前端展示）'); return false }
  }
  return true
}

function makeCfgRowFromForm(): TaskCfgRow {
  const now = new Date()
  const date8 = now.toISOString().slice(0, 10).replace(/-/g, '')
  const rand = String(Math.floor(Math.random() * 9000) + 1000)
  return {
    key: String(Date.now()),
    taskId: 'TASK' + date8 + rand,
    activityName: cfgForm.activityName || '未命名任务',
    taskStatus: cfgForm.taskStatus,
    configStatus: cfgForm.configStatus,
    validityType: cfgForm.validityType,
    validStartTime: cfgForm.validStartTime,
    validEndTime: cfgForm.validEndTime,
    enableOrderLimit: cfgForm.enableOrderLimit,
    minOrderCount: cfgForm.minOrderCount,
    enableMemberCardLimit: cfgForm.enableMemberCardLimit,
    memberCardCondition: cfgForm.memberCardCondition,
    enableDriverTags: cfgForm.enableDriverTags,
    driverTags: [...cfgForm.driverTags],
    enableCrowdLimit: cfgForm.enableCrowdLimit,
    crowdCodes: [...cfgForm.crowdCodes],
    enableAbLimit: cfgForm.enableAbLimit,
    abExpId: cfgForm.abExpId,
    abGroups: [...cfgForm.abGroups],
    cycleType: cfgForm.cycleType,
    cooldownDays: cfgForm.cycleType === 'cycle' ? cfgForm.cooldownDays : 0,
    taskType: cfgForm.taskType,
    targetOrderCount: cfgForm.targetOrderCount,
    hasDriverMetric: cfgForm.hasDriverMetric,
    metricType: cfgForm.metricType,
    metricThreshold: cfgForm.metricThreshold,
    rewardTypes: [...cfgForm.rewardTypes],
    normalRewardCode: cfgForm.normalRewardCode,
    taskTitle: cfgForm.taskTitle,
    taskSubtitle: cfgForm.taskSubtitle,
    taskDesc: cfgForm.taskDesc,
    rewardDesc: cfgForm.rewardDesc,
    taskIcon: cfgForm.taskIcon,
    taskBadge: cfgForm.taskBadge,
    createTime: now.toISOString().slice(0, 19).replace('T', ' '),
  }
}

/* ------- 任务配置页按钮处理 ------- */
function onCfgSearch() {
  Object.assign(appliedCfgFilter, cfgFilter)
  cfgPage.current = 1
  ElMessage.success('查询成功')
}
function onCfgReset() {
  cfgFilter.activityName = ''
  cfgFilter.taskStatus = undefined
  Object.assign(appliedCfgFilter, cfgFilter)
  cfgPage.current = 1
  ElMessage.info('已重置筛选条件')
}
function onCreateCfg() {
  resetCfgForm()
  cfgDialog.mode = 'create'
  cfgDialog.editingKey = ''
  cfgDialog.visible = true
}
function onViewCfg(row: unknown) {
  const r = taskCfgRow(row)
  fillCfgFormFromRow(r)
  cfgDialog.mode = 'view'; cfgDialog.editingKey = r.key
  cfgDialog.visible = true
}
function onEditCfg(row: TaskCfgRow | unknown) {
  const r = taskCfgRow(row)
  fillCfgFormFromRow(r)
  cfgDialog.mode = 'edit'; cfgDialog.editingKey = r.key
  cfgDialog.visible = true
}
function onLogCfg(row: unknown) {
  ElMessage.info(`查看 ${taskCfgRow(row).taskId} 操作日志（待接入）`)
}

function onSaveCfgDraft() {
  if (!validateCfg(true)) return
  const newRow = makeCfgRowFromForm()
  if (cfgDialog.mode === 'create') {
    cfgTable.value.unshift(newRow)
  } else {
    const idx = cfgTable.value.findIndex((r) => r.key === cfgDialog.editingKey)
    if (idx >= 0) {
      newRow.key = cfgTable.value[idx].key
      newRow.taskId = cfgTable.value[idx].taskId
      newRow.createTime = cfgTable.value[idx].createTime
      cfgTable.value[idx] = newRow
    }
  }
  cfgDialog.visible = false
  ElMessage.success('草稿已保存')
}
function onSubmitCfg() {
  if (!validateCfg(false)) return
  const newRow = makeCfgRowFromForm()
  if (cfgDialog.mode === 'create') {
    cfgTable.value.unshift(newRow)
    ElMessage.success('任务配置创建成功')
  } else {
    const idx = cfgTable.value.findIndex((r) => r.key === cfgDialog.editingKey)
    if (idx >= 0) {
      newRow.key = cfgTable.value[idx].key
      newRow.taskId = cfgTable.value[idx].taskId
      newRow.createTime = cfgTable.value[idx].createTime
      cfgTable.value[idx] = newRow
      ElMessage.success('任务配置修改成功')
    }
  }
  cfgDialog.visible = false
}

/* 任务 icon 上传文件列表（picture-card 模式预览使用） */
const taskIconFileList = ref<any[]>([])
function onTaskIconChange(uploadFile: any) {
  if (uploadFile && uploadFile.raw) {
    if (cfgForm.taskIcon && cfgForm.taskIcon.startsWith('blob:')) {
      try { URL.revokeObjectURL(cfgForm.taskIcon) } catch {}
    }
    cfgForm.taskIcon = URL.createObjectURL(uploadFile.raw)
    taskIconFileList.value = [{
      name: uploadFile.name || 'task-icon',
      url: cfgForm.taskIcon,
      raw: uploadFile.raw,
    }]
  }
}
function onTaskIconRemove() {
  if (cfgForm.taskIcon && cfgForm.taskIcon.startsWith('blob:')) {
    try { URL.revokeObjectURL(cfgForm.taskIcon) } catch {}
  }
  cfgForm.taskIcon = ''
  taskIconFileList.value = []
}
function onTaskIconExceed() {
  ElMessage.warning('任务 icon 仅允许上传一张图片，请先移除现有图片')
}

/* ====================================================== */
/* ========== 页面 2：任务参与记录 ========== */
/* ====================================================== */

const dataFilter = reactive({
  driverId: '',
  taskId: '',
  userTaskStatus: undefined as UserTaskStatus | undefined,
  claimStatus: undefined as ClaimStatus | undefined,
})
const appliedDataFilter = reactive({ ...dataFilter })
const dataPage = reactive({ current: 1, size: 10, jump: 1 })

function partRow(row: unknown): PartRow { return row as PartRow }

const dataTable = ref<PartRow[]>([
  {
    key: '1', driverId: 'DRV88310001',
    deliveryTaskRelationId: 'REL-0001-01',
    taskId: 'TASK202607090001',
    participationId: 'PART-0710-0001-A1',
    taskTitle: '本周完成30单，领取奖励',
    userTaskStatus: 'progress',
    completedOrderCount: 18, targetOrderCount: 30,
    hasDriverMetric: true, metricType: 'finish_rate',
    metricThreshold: 75, driverMetricValue: 72,
    claimStatus: 'unclaimed',
    rewardTypes: ['normal'], prizeResult: 'none',
    cycleStartTime: '2026-07-08 00:00:00',
  },
  {
    key: '2', driverId: 'DRV88310002',
    deliveryTaskRelationId: 'REL-0001-01',
    taskId: 'TASK202607090001',
    participationId: 'PART-0710-0001-A2',
    taskTitle: '本周完成30单，领取奖励',
    userTaskStatus: 'claimable',
    completedOrderCount: 32, targetOrderCount: 30,
    hasDriverMetric: true, metricType: 'finish_rate',
    metricThreshold: 75, driverMetricValue: 78,
    claimStatus: 'unclaimed',
    rewardTypes: ['normal'], prizeResult: 'none',
    cycleStartTime: '2026-07-08 00:00:00',
  },
  {
    key: '3', driverId: 'DRV88310003',
    deliveryTaskRelationId: 'REL-0002-01',
    taskId: 'TASK202607090002',
    participationId: 'PART-0710-0002-B1',
    taskTitle: '新人首月完成20单，领取超值券包',
    userTaskStatus: 'claimed',
    completedOrderCount: 20, targetOrderCount: 20,
    hasDriverMetric: false, metricType: 'finish_rate',
    metricThreshold: 0, driverMetricValue: 0,
    claimStatus: 'success',
    rewardTypes: ['normal'], prizeResult: 'success',
    prizeRewardCode: 'PRIZE_NEWDRIVER_002',
    cycleStartTime: '2026-07-01 00:00:00', claimTime: '2026-07-06 21:05:32',
  },
  {
    key: '4', driverId: 'DRV88310004',
    deliveryTaskRelationId: 'REL-0004-01',
    taskId: 'TASK202607090003',
    participationId: 'PART-0710-0003-C1',
    taskTitle: '每日完成15单 + 接单率≥60% 领奖励',
    userTaskStatus: 'claimable',
    completedOrderCount: 16, targetOrderCount: 15,
    hasDriverMetric: true, metricType: 'accept_rate',
    metricThreshold: 60, driverMetricValue: 64,
    claimStatus: 'unclaimed',
    rewardTypes: ['normal'], prizeResult: 'none',
    cycleStartTime: '2026-07-10 00:00:00',
  },
  {
    key: '5', driverId: 'DRV88310005',
    deliveryTaskRelationId: 'REL-0004-01',
    taskId: 'TASK202607090003',
    participationId: 'PART-0710-0003-C2',
    taskTitle: '每日完成15单 + 接单率≥60% 领奖励',
    userTaskStatus: 'claimed',
    completedOrderCount: 17, targetOrderCount: 15,
    hasDriverMetric: true, metricType: 'accept_rate',
    metricThreshold: 60, driverMetricValue: 66,
    claimStatus: 'fail',
    rewardTypes: ['normal'], prizeResult: 'fail',
    cycleStartTime: '2026-07-08 00:00:00', claimTime: '2026-07-08 22:11:45',
  },
  {
    key: '6', driverId: 'DRV88310006',
    deliveryTaskRelationId: 'REL-0001-01',
    taskId: 'TASK202607090001',
    participationId: 'PART-0710-0001-A3',
    taskTitle: '本周完成30单，领取奖励',
    userTaskStatus: 'cooldown',
    completedOrderCount: 30, targetOrderCount: 30,
    hasDriverMetric: true, metricType: 'finish_rate',
    metricThreshold: 75, driverMetricValue: 80,
    claimStatus: 'success',
    rewardTypes: ['normal'], prizeResult: 'success',
    cycleStartTime: '2026-07-01 00:00:00', claimTime: '2026-07-07 19:30:10',
  },
  {
    key: '7', driverId: 'DRV88310007',
    deliveryTaskRelationId: 'REL-0005-01',
    taskId: 'TASK202607090005',
    participationId: 'PART-0710-0005-D1',
    taskTitle: '暑期冲刺50单+接完率80%领大奖',
    userTaskStatus: 'expired',
    completedOrderCount: 42, targetOrderCount: 50,
    hasDriverMetric: true, metricType: 'finish_rate',
    metricThreshold: 80, driverMetricValue: 82,
    claimStatus: 'unclaimed',
    rewardTypes: ['normal'], prizeResult: 'none',
    cycleStartTime: '2026-06-20 00:00:00',
  },
  {
    key: '8', driverId: 'DRV88310008',
    deliveryTaskRelationId: 'REL-0003-01',
    taskId: 'TASK202607090004',
    participationId: 'PART-0710-0004-E1',
    taskTitle: '回归专属：完成10单领奖励',
    userTaskStatus: 'claimed',
    completedOrderCount: 10, targetOrderCount: 10,
    hasDriverMetric: true, metricType: 'finish_rate',
    metricThreshold: 70, driverMetricValue: 75,
    claimStatus: 'fail',
    rewardTypes: ['normal'], prizeResult: 'fail',
    cycleStartTime: '2026-07-05 00:00:00', claimTime: '2026-07-09 10:22:05',
  },
  {
    key: '9', driverId: 'DRV88310009',
    deliveryTaskRelationId: 'REL-0001-02',
    taskId: 'TASK202607090006',
    participationId: 'PART-0710-0006-F1',
    taskTitle: '月度服务之星·评分达标赢好礼',
    userTaskStatus: 'progress',
    completedOrderCount: 68, targetOrderCount: 100,
    hasDriverMetric: true, metricType: 'service_score',
    metricThreshold: 95, driverMetricValue: 93,
    claimStatus: 'unclaimed',
    rewardTypes: ['normal'], prizeResult: 'none',
    prizeRewardCode: 'PRIZE_STAR_006',
    cycleStartTime: '2026-07-01 00:00:00',
  },
  {
    key: '10', driverId: 'DRV88310010',
    deliveryTaskRelationId: 'REL-0006-01',
    taskId: 'TASK20260710008',
    participationId: 'PART-0710-0008-H1',
    taskTitle: '完成3单激活奖励',
    userTaskStatus: 'claimable',
    completedOrderCount: 3, targetOrderCount: 3,
    hasDriverMetric: false, metricType: 'finish_rate',
    metricThreshold: 0, driverMetricValue: 0,
    claimStatus: 'unclaimed',
    rewardTypes: ['normal'], prizeResult: 'none',
    cycleStartTime: '2026-07-10 08:00:00',
  },
  {
    key: '11', driverId: 'DRV88310011',
    deliveryTaskRelationId: 'REL-0002-02',
    taskId: 'TASK20260710007',
    participationId: 'PART-0710-0007-G1',
    taskTitle: '每日完成5单领基础奖励',
    userTaskStatus: 'claimed',
    completedOrderCount: 5, targetOrderCount: 5,
    hasDriverMetric: false, metricType: 'finish_rate',
    metricThreshold: 0, driverMetricValue: 0,
    claimStatus: 'success',
    rewardTypes: ['normal'], prizeResult: 'success',
    prizeRewardCode: 'PRIZE_DAILY_007',
    cycleStartTime: '2026-07-09 00:00:00', claimTime: '2026-07-09 22:45:10',
  },
])

const filteredDataTable = computed<PartRow[]>(() => {
  return dataTable.value.filter((row) => {
    if (appliedDataFilter.driverId
      && !row.driverId.toLowerCase().includes(appliedDataFilter.driverId.toLowerCase())) return false
    if (appliedDataFilter.taskId
      && !row.taskId.toLowerCase().includes(appliedDataFilter.taskId.toLowerCase())) return false
    if (appliedDataFilter.userTaskStatus
      && row.userTaskStatus !== appliedDataFilter.userTaskStatus) return false
    if (appliedDataFilter.claimStatus
      && row.claimStatus !== appliedDataFilter.claimStatus) return false
    return true
  })
})

/* 参与记录按钮 */
function onDataSearch() {
  Object.assign(appliedDataFilter, dataFilter)
  dataPage.current = 1
  ElMessage.success('查询成功')
}
function onDataReset() {
  dataFilter.driverId = ''
  dataFilter.taskId = ''
  dataFilter.userTaskStatus = undefined
  dataFilter.claimStatus = undefined
  Object.assign(appliedDataFilter, dataFilter)
  dataPage.current = 1
  ElMessage.info('已重置筛选条件')
}

const partDrawer = reactive({
  visible: false,
  data: null as PartRow | unknown | null,
})
function onViewPart(row: unknown) {
  partDrawer.data = row
  partDrawer.visible = true
}
function onRetryIssueByType() {
  if (!partDrawer.data) return
  const r = partRow(partDrawer.data)
  if (r.prizeResult !== 'fail') { ElMessage.info('普通奖品当前状态无需重试'); return }
  ElMessageBox.confirm(
    `对参与记录 ${r.participationId}（mid: ${r.driverId}）的「普通奖品」重新发起发放？`,
    '重试发放', { type: 'warning' },
  )
    .then(() => {
      r.prizeResult = 'success'
      r.claimStatus = 'success'
      ElMessage.success('普通奖品重试发放完成')
    })
    .catch(() => {})
}
</script>

<style scoped>
/* 全局样式见 App.css */
</style>
