/**
 * @jsx createElement
 * @jsxFrag Fragment
 */
import {createElement, Fragment} from 'react';
import * as React from 'react';
import {Agent, Persona} from '../app';

interface DashboardProps {
  persona: Persona;
  agents: Agent[];
  isGuidedExperienceEnabled?: boolean;
  isGuidedExperienceActive?: boolean;
  startGuidedExperience?: (type?: 'ops' | 'products') => void;
}

const MockBadge = () => (
  <span style={{
    fontSize: '0.65rem',
    background: '#f1f3f4',
    color: '#5f6368',
    padding: '2px 6px',
    borderRadius: '4px',
    marginLeft: '8px',
    verticalAlign: 'middle',
    border: '1px solid #dadce0',
    fontWeight: 400
  }}>MOCK DATA</span>
);

const MetricCard = ({title, value, mock = false, color = '#202124'}: {title: string, value: string | number, mock?: boolean, color?: string}) => (
  <div style={{
    background: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)',
    flex: 1,
    minWidth: '200px'
  }}>
    <div style={{ fontSize: '0.9rem', color: '#5f6368', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {title}
      {mock && <MockBadge />}
    </div>
    <div style={{ fontSize: '1.75rem', fontWeight: 400, color: color }}>{value}</div>
  </div>
);

const ChartContainer = ({title, children, mock = false}: {title: string, children: React.ReactNode, mock?: boolean}) => (
  <div style={{
    background: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)',
    marginTop: '1.5rem'
  }}>
    <div style={{ fontSize: '1rem', fontWeight: 400, color: '#202124', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {title}
      {mock && <MockBadge />}
    </div>
    <div style={{ width: '100%', height: '200px', display: 'flex', alignItems: 'stretch', padding: '0 1rem' }}>
      {children}
    </div>
  </div>
);

const AuthorityBlurb = ({title, description, icon, color = '#1a73e8', bgColor = '#e8f0fe'}: {title: string, description: React.ReactNode, icon: React.ReactNode, color?: string, bgColor?: string}) => (
  <div style={{
    background: bgColor,
    borderLeft: `4px solid ${color}`,
    padding: '1.5rem 2rem',
    borderRadius: '0 12px 12px 0',
    marginBottom: '2rem',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1.5rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  }}>
    <div style={{ color: color, marginTop: '4px' }}>{icon}</div>
    <div>
      <div style={{ fontWeight: 700, color: color, marginBottom: '0.5rem', fontSize: '1.1rem' }}>{title}</div>
      <div style={{ fontSize: '1rem', color: '#374151', lineHeight: '1.6' }}>{description}</div>
    </div>
  </div>
);

// YAxis is now integrated into each chart type for precise alignment


const SimpleBarChart = ({data, color = '#1a73e8'}: {data: {label: string, value: number}[], color?: string}) => {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between', 
        height: '100%', 
        paddingRight: '8px', 
        borderRight: '1px solid #f1f3f4',
        fontSize: '0.65rem',
        color: '#5f6368',
        textAlign: 'right',
        minWidth: '35px',
        paddingBottom: '20px',
        boxSizing: 'border-box'
      }}>
        <span>{max > 1000 ? (max/1000).toFixed(1) + 'k' : Math.round(max)}</span>
        <span>{max > 1000 ? (max/2000).toFixed(1) + 'k' : Math.round(max/2)}</span>
        <span>0</span>
      </div>
      <div style={{ display: 'flex', flex: 1, gap: '10px', paddingLeft: '10px' }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
            <div style={{ 
              width: '40%', 
              minWidth: '20px',
              height: `${(d.value / max) * 100}%`, 
              background: color, 
              borderRadius: '4px 4px 0 0',
              transition: 'height 0.3s ease',
              maxHeight: 'calc(100% - 20px)'
            }} title={`${d.label}: ${d.value}`}></div>
            <span style={{ fontSize: '0.7rem', color: '#5f6368', whiteSpace: 'nowrap', height: '12px', lineHeight: '12px' }}>{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const SimpleLineChart = ({data, color = '#1a73e8'}: {data: {label: string, value: number}[], color?: string}) => {
  const max = Math.max(...data.map(d => d.value), 1);
  const len = data.length;
  if (len === 0) return <div style={{ color: '#5f6368', fontSize: '0.8rem', alignSelf: 'center' }}>No data available</div>;

  const vWidth = 400;
  const vHeight = 150;
  const marginX = 20;
  const marginY = 15;
  const chartWidth = vWidth - 2 * marginX;
  const chartHeight = vHeight - 2 * marginY;

  const pathData = data.map((d, i) => {
    const x = len > 1 ? marginX + (i / (len - 1)) * chartWidth : vWidth / 2;
    const y = (vHeight - marginY) - (d.value / max) * chartHeight;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between', 
        height: '100%', 
        paddingRight: '8px', 
        borderRight: '1px solid #f1f3f4',
        fontSize: '0.65rem',
        color: '#5f6368',
        textAlign: 'right',
        minWidth: '35px',
        paddingTop: `${marginY}px`,
        paddingBottom: `calc(${marginY}px + 28px)`,
        boxSizing: 'border-box'
      }}>
        <span>{max > 1000 ? (max/1000).toFixed(1) + 'k' : Math.round(max)}</span>
        <span>{max > 1000 ? (max/2000).toFixed(1) + 'k' : Math.round(max/2)}</span>
        <span>0</span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingLeft: '10px' }}>
        <div style={{ flex: 1, minHeight: 0 }}>
          <svg 
            width="100%" 
            height="100%" 
            viewBox={`0 0 ${vWidth} ${vHeight}`} 
            preserveAspectRatio="none"
            style={{ display: 'block' }}
          >
            <path
              d={pathData}
              fill="none"
              stroke={color}
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {data.map((d, i) => {
              const x = len > 1 ? marginX + (i / (len - 1)) * chartWidth : vWidth / 2;
              const y = (vHeight - marginY) - (d.value / max) * chartHeight;
              return (
                <circle key={i} cx={x} cy={y} r="3" fill={color}>
                  <title>{`${d.label}: ${d.value}`}</title>
                </circle>
              );
            })}
          </svg>
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          padding: `0 ${marginX}px`, 
          marginTop: '8px',
          borderTop: '1px solid #f1f3f4',
          paddingTop: '8px',
          height: '12px',
          lineHeight: '12px'
        }}>
          <span style={{ fontSize: '0.7rem', color: '#5f6368', whiteSpace: 'nowrap' }}>{data[0].label}</span>
          {len > 2 && <span style={{ fontSize: '0.7rem', color: '#5f6368', whiteSpace: 'nowrap' }}>{data[Math.floor(len/2)].label}</span>}
          {len > 1 && <span style={{ fontSize: '0.7rem', color: '#5f6368', whiteSpace: 'nowrap' }}>{data[len-1].label}</span>}
        </div>
      </div>
    </div>
  );
};

const MOCK_ADOPTION_DATA = [
  {label: 'Jan', value: 45},
  {label: 'Feb', value: 52},
  {label: 'Mar', value: 48},
  {label: 'Apr', value: 61},
  {label: 'May', value: 55},
  {label: 'Jun', value: 67}
];

const MOCK_TRUST_SCORE_DATA = [
  {label: 'Jan', value: 78},
  {label: 'Feb', value: 82},
  {label: 'Mar', value: 85},
  {label: 'Apr', value: 89},
  {label: 'May', value: 92},
  {label: 'Jun', value: 95}
];

const MOCK_LATENCY_DATA = [
  {label: 'Jan', value: 120},
  {label: 'Feb', value: 115},
  {label: 'Mar', value: 130},
  {label: 'Apr', value: 110},
  {label: 'May', value: 105},
  {label: 'Jun', value: 98}
];

export const Dashboard: React.FC<DashboardProps> = ({
  persona, 
  agents,
  isGuidedExperienceEnabled,
  isGuidedExperienceActive,
  startGuidedExperience
}) => {
  const totalAgents = agents.length;

  if (persona === 'C-Suite Executive') {
    const themeColor = '#6b21a8';
    const bgColor = '#faf5ff';
    return (
      <div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '2rem', color: themeColor }}>Executive Strategy Dashboard</h2>
        <AuthorityBlurb 
          title="Strategic Oversight & ROI Authority"
          description={
            <Fragment>
              As a C-Suite Executive, you have a global view of all system assets and market performance. Your role is focused on strategic alignment, performance monitoring, and ensuring long-term ROI. 
              <div style={{ marginTop: '0.75rem', fontWeight: 700 }}>
                <span style={{ color: '#991b1b' }}>NOTE:</span> You do not have access to operational tasks such as creating or editing products, agents, or tools, nor can you approve integration requests or modify governance policies.
              </div>
            </Fragment>
          }
          color={themeColor}
          bgColor={bgColor}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          }
        />
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <MetricCard title="Total Company Revenue" value="$4.28M" mock color={themeColor} />
          <MetricCard title="Active AI Agents" value={totalAgents} color={themeColor} />
          <MetricCard title="Customer Satisfaction" value="88.4%" mock color={themeColor} />
          <MetricCard title="Operational Efficiency" value="+12.5%" mock color={themeColor} />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
          <ChartContainer title="Revenue Growth by Quarter" mock>
            <SimpleBarChart color={themeColor} data={[
              {label: 'Q1', value: 120},
              {label: 'Q2', value: 150},
              {label: 'Q3', value: 110},
              {label: 'Q4', value: 180}
            ]} />
          </ChartContainer>
          <ChartContainer title="Agent Adoption over Time" mock>
            <SimpleLineChart color={themeColor} data={MOCK_ADOPTION_DATA} />
          </ChartContainer>
          <ChartContainer title="Quality Trust Score" mock>
            <SimpleLineChart color={themeColor} data={MOCK_TRUST_SCORE_DATA} />
          </ChartContainer>
          <ChartContainer title="Platform Latency" mock>
            <SimpleLineChart color={themeColor} data={MOCK_LATENCY_DATA} />
          </ChartContainer>
        </div>

        <ChartContainer title="Agent Usage by Department" mock>
          <SimpleBarChart color={themeColor} data={[
            {label: 'Customer Svc', value: 450},
            {label: 'Logistics', value: 320},
            {label: 'Marketing', value: 210},
            {label: 'Finance', value: 180},
            {label: 'HR', value: 90}
          ]} />
        </ChartContainer>
      </div>
    );
  }

  if (persona === 'Governance Administrator') {
    const themeColor = '#0d9488';
    const bgColor = '#f0fdfa';
    return (
      <div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '2rem', color: themeColor }}>Governance & Compliance Dashboard</h2>
        <AuthorityBlurb 
          title="Governance & Compliance Authority"
          description={
            <Fragment>
              As a Governance Administrator, you are the custodian of global safety and compliance standards. You have full authority to manage Agent and Tool Profiles, ensuring every AI interaction meets regional regulatory requirements.
              <div style={{ marginTop: '0.75rem', fontWeight: 700 }}>
                <span style={{ color: '#991b1b' }}>NOTE:</span> You do not have access to business-level product creation, channel management, storefront configuration, or the approval of consumer application requests.
              </div>
            </Fragment>
          }
          color={themeColor}
          bgColor={bgColor}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          }
        />
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <MetricCard title="Compliance Adherence" value="95.2%" mock color={themeColor} />
          <MetricCard title="Blocked Policy Violations" value="12" mock color={themeColor} />
          <MetricCard title="Governance Latency Impact" value="+45ms" mock color={themeColor} />
          <MetricCard title="Policy Validated Agents" value={totalAgents} color={themeColor} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
          <ChartContainer title="Governance Policy Blocks (Trend)" mock>
            <SimpleLineChart color={themeColor} data={[
              {label: 'Mon', value: 2},
              {label: 'Tue', value: 5},
              {label: 'Wed', value: 3},
              {label: 'Thu', value: 8},
              {label: 'Fri', value: 4}
            ]} />
          </ChartContainer>
          <ChartContainer title="Agent Adoption over Time" mock>
            <SimpleLineChart color={themeColor} data={MOCK_ADOPTION_DATA} />
          </ChartContainer>
          <ChartContainer title="Quality Trust Score" mock>
            <SimpleLineChart color={themeColor} data={MOCK_TRUST_SCORE_DATA} />
          </ChartContainer>
          <ChartContainer title="Platform Latency" mock>
            <SimpleLineChart color={themeColor} data={MOCK_LATENCY_DATA} />
          </ChartContainer>
        </div>

        <ChartContainer title="Risk Assessment by Policy Type" mock>
          <SimpleBarChart color={themeColor} data={[
            {label: 'Data Privacy', value: 98},
            {label: 'Ethical AI', value: 85},
            {label: 'Sec Ops', value: 92},
            {label: 'Bias Mitigation', value: 78}
          ]} />
        </ChartContainer>
      </div>
    );
  }

  if (persona === 'Product Owner') {
    const themeColor = '#4338ca';
    const bgColor = '#eef2ff';
    return (
      <div>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: themeColor }}>Product Strategy Dashboard</h2>
          </div>
          {/* Guided Experience triggers moved to Simulator Control Panel */}
        </header>
        <AuthorityBlurb 
          title="Product Catalog & Distribution Authority"
          description={
            <Fragment>
              As a Product Owner, you have full authority over the bundling of simulation assets into marketable Products and their publication to regional Channels. You are responsible for regional go-to-market strategy.
            </Fragment>
          }
          color={themeColor}
          bgColor={bgColor}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="2" y1="10" x2="22" y2="10"></line>
            </svg>
          }
        />



        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <MetricCard title="Product Revenue ROI" value="$24.8k" mock color={themeColor} />
          <MetricCard title="Agent Ecosystem Size" value={totalAgents} color={themeColor} />
          <MetricCard title="User Feature Adoption" value="64.8%" mock color={themeColor} />
          <MetricCard title="Marketplace Conversions" value="12.5%" mock color={themeColor} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
          <ChartContainer title="Product Profit Margin (Estimated)" mock>
            <SimpleBarChart color={themeColor} data={[
              {label: 'Prod A', value: 45},
              {label: 'Prod B', value: 30},
              {label: 'Prod C', value: 55}
            ]} />
          </ChartContainer>
          <ChartContainer title="Agent Adoption over Time" mock>
            <SimpleLineChart color={themeColor} data={MOCK_ADOPTION_DATA} />
          </ChartContainer>
          <ChartContainer title="Quality Trust Score" mock>
            <SimpleLineChart color={themeColor} data={MOCK_TRUST_SCORE_DATA} />
          </ChartContainer>
          <ChartContainer title="Platform Latency" mock>
            <SimpleLineChart color={themeColor} data={MOCK_LATENCY_DATA} />
          </ChartContainer>
        </div>

        <ChartContainer title="Top Feature Usage" mock>
          <SimpleBarChart color={themeColor} data={[
            {label: 'Summarize', value: 850},
            {label: 'Booking', value: 720},
            {label: 'Schedule', value: 640},
            {label: 'Rewards', value: 410}
          ]} />
        </ChartContainer>
      </div>
    );
  }

  return <div>Select a valid Persona to view dashboard.</div>;
};
