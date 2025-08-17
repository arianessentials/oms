"use client";

import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';

const drawerWidth = 240;
const navItems = [
    { label: 'Dashboard', href: '/' },
    { label: 'Orders', href: '/orders' },
    { label: 'Archive', href: '/archive' },
    { label: 'Create Order', href: '/orders/create-order' },
    { label: 'Products', href: '/products' },
];

export default function SideBar() {
    const DrawerList = (
        <Box
            sx={{ width: drawerWidth }}
            role="navigation"
            aria-label="main navigation"
        >
            <List>
                {navItems.map((item) => (
                    <ListItem
                        component={Link}
                        key={item.label}
                        href={item.href}
                        disablePadding
                    >
                        <ListItemButton>
                            {/* Your icon logic here, you'll need to expand this part */}
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Drawer
            variant="permanent"
            anchor="left"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
        >
            {DrawerList}
        </Drawer>
    );
}
