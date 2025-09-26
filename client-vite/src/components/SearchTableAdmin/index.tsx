import React, { useState, useCallback } from 'react';
import { Input, Button, Space, Card } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';

const useDebounce = (callback: (...args: any[]) => void, delay: number) => {
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    const debouncedCallback = useCallback((...args: any[]) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => callback(...args), delay);
    }, [callback, delay]);

    const cancel = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);

    return { debouncedCallback, cancel };
};

export interface SearchFilters {
    searchText?: string;
    [key: string]: any;
}

export interface SearchTableAdminProps {
    onSearch: (filters: SearchFilters) => void;
    loading?: boolean;
    placeholder?: string;
    showClearButton?: boolean;
    debounceMs?: number;
    extraFilters?: React.ReactNode;
}

const SearchTableAdmin: React.FC<SearchTableAdminProps> = ({
    onSearch,
    loading = false,
    placeholder = 'Nhập từ khóa tìm kiếm...',
    showClearButton = true,
    debounceMs = 500,
    extraFilters
}) => {
    const [searchText, setSearchText] = useState<string>('');

    const { debouncedCallback: debouncedSearch } = useDebounce(
        (text: string) => {
            onSearch({
                searchText: text.trim()
            });
        },
        debounceMs
    );

    const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchText(value);
        
        debouncedSearch(value);
    };

    const handleClear = () => {
        setSearchText('');
        onSearch({
            searchText: ''
        });
    };

    const handleSearch = () => {
        onSearch({
            searchText: searchText.trim()
        });
    };

    return (
        <Card 
            size="small" 
            style={{ marginBottom: 16 }}
            bodyStyle={{ padding: '12px 16px' }}
        >
            <Space direction="vertical" style={{ width: '100%' }}>
                <Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Input
                        placeholder={placeholder}
                        value={searchText}
                        onChange={handleSearchTextChange}
                        onPressEnter={handleSearch}
                        style={{ 
                            width: 400,
                            minWidth: 200
                        }}
                        size="middle"
                        suffix={
                            <SearchOutlined 
                                style={{ color: '#bfbfbf', cursor: 'pointer' }}
                                onClick={handleSearch}
                            />
                        }
                        //disabled={loading}
                    />

                    {showClearButton && (searchText || extraFilters) && (
                        <Button
                            icon={<ClearOutlined />}
                            onClick={handleClear}
                            disabled={loading}
                            size="middle"
                        >
                            Xóa bộ lọc
                        </Button>
                    )}
                </Space>

                {extraFilters && (
                    <div style={{ marginTop: 8 }}>
                        {extraFilters}
                    </div>
                )}
            </Space>
        </Card>
    );
};

export default SearchTableAdmin;
