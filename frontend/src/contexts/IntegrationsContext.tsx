import React, { useMemo } from 'react';
import { Integrations } from '../tools/Models';

export const IntegrationsContext = React.createContext<{
    captcha: {
        enabled?: boolean;
        publicKey?: string;
    }
}>(
    {
        captcha: {
            enabled: false,
            publicKey: ''
        }
    });

export const IntegrationsContextProvider: React.FC<{ integrations: Integrations }> = ({ integrations, children }) => {

    const captcha = useMemo(() => (integrations?.ReCaptcha || {}), [integrations]);

    return (
        <IntegrationsContext.Provider value={{ captcha }}>
            {children}
        </IntegrationsContext.Provider>
    );
}