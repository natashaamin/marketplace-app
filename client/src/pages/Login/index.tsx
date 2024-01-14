import {
    AlipayCircleOutlined,
    LockOutlined,
    MobileOutlined,
    TaobaoCircleOutlined,
    UserOutlined,
    WeiboCircleOutlined,
} from '@ant-design/icons';
import {
    LoginForm,
    ProConfigProvider,
    ProFormCaptcha,
    ProFormCheckbox,
    ProFormText,
    setAlpha,
} from '@ant-design/pro-components';
import { Space, Tabs, message, theme } from 'antd';
import type { CSSProperties } from 'react';
import React, { useState } from 'react';
import logo from '@/assets/logo.png';
import { history } from '@umijs/max';
import { WalletType, connect } from 'graz';
import KeplrLogo from '@/assets/kepler.svg';
import { useAuth } from '@/hooks/useAuth';

type LoginType = 'phone' | 'account';

export default () => {
    const { token } = theme.useToken();
    const { login } = useAuth();
    const [loginType, setLoginType] = useState<LoginType>('account');

    const iconStyles: CSSProperties = {
        marginInlineStart: '16px',
        color: setAlpha(token.colorTextBase, 0.2),
        width: '24px',
        height: '24px',
        verticalAlign: 'middle',
        cursor: 'pointer',
    };

    const handleSubmit = async (value: any) => {
        const { username, password } = value;
        try {
            const response = await fetch('/api/v1/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
            });
    
            const data = await response.json();
            if (response.ok && data.token) {
                login(data.token)
                history.replace('/')
            } else {
                message.error("Login failed: " + (data.message || 'Unauthorized'));
            }
        } catch (error) {
            console.error("Login error:", error);
            message.error("An error occurred during login.");
        }
    }
    

    return (
        <ProConfigProvider hashed={false}>
            <div>
                <LoginForm
                    logo={logo}
                    title="Electrify"
                    subTitle="Welcome to Electrify"
                    actions={
                        <Space>
                            Other
                            <img src={KeplrLogo} style={iconStyles} alt="Keplr Logo" onClick={() => connect({ chainId: ["cosmoshub-4"], walletType: WalletType.KEPLR})}/>
                        </Space>
                    }
                    onFinish={async (value) => await handleSubmit(value)}
                    submitter={{
                        searchConfig: {
                            submitText: 'Submit'
                        }
                    }}
                >
                    <Tabs
                        centered
                        activeKey={loginType}
                    >
                        <Tabs.TabPane key={'account'} tab={'Account Login'} />
                    </Tabs>
                    {loginType === 'account' && (
                        <>
                            <ProFormText
                                name="username"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <UserOutlined className={'prefixIcon'} />,
                                }}
                                placeholder={'Username'}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter username!',
                                    },
                                ]}
                            />
                            <ProFormText.Password
                                name="password"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined className={'prefixIcon'} />,
                                    strengthText:
                                        'Password should contain numbers, letters and special characters, at least 8 characters long.',

                                    statusRender: (value) => {
                                        const getStatus = () => {
                                            if (value && value.length > 12) {
                                                return 'ok';
                                            }
                                            if (value && value.length > 6) {
                                                return 'pass';
                                            }
                                            return 'poor';
                                        };
                                        const status = getStatus();
                                        if (status === 'pass') {
                                            return (
                                                <div style={{ color: token.colorWarning }}>
                                                    Strength：medium
                                                </div>
                                            );
                                        }
                                        if (status === 'ok') {
                                            return (
                                                <div style={{ color: token.colorSuccess }}>
                                                    Strength：strong
                                                </div>
                                            );
                                        }
                                        return (
                                            <div style={{ color: token.colorError }}>Strength：weak</div>
                                        );
                                    },
                                }}
                                placeholder={'Password'}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter password!',
                                    },
                                ]}
                            />
                        </>
                    )}
                    <div
                        style={{
                            marginBlockEnd: 24,
                        }}
                    >
                        <ProFormCheckbox noStyle name="autoLogin">
                            Remember me
                        </ProFormCheckbox>
                        <a
                            style={{
                                float: 'right',
                            }}
                        >
                            Forgot Password
                        </a>
                    </div>
                </LoginForm>
            </div>
        </ProConfigProvider>
    );
};