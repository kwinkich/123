import { getHttpEndpoint } from '@orbs-network/ton-access';
import { useEffect, useState } from 'react';
import { TonClient } from 'ton';

export function useTonClient() {
    const [client, setClient] = useState<TonClient | null>(null);

    useEffect(() => {
        let isMounted = true;

        (async () => {
            try {
                const endpoint = await getHttpEndpoint({ network: 'mainnet' });
                if (isMounted) {
                    setClient(
                        new TonClient({
                            endpoint,
                        }),
                    );
                }
            } catch (error) {
                console.error('Failed to initialize TonClient:', error);
            }
        })();

        return () => {
            isMounted = false;
        };
    }, []);

    return { client };
}
