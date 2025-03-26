import React, { useCallback } from "react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    useSidebar,
    SidebarTrigger
} from "./ui/sidebar";
import { useTranslation } from "react-i18next";
import { getLanguage, setAppLanguage } from "../helpers/language_helpers";
import { IconMehr } from "./ui/icons";
import { cn } from "@/utils/tailwind";
import { Button } from "./ui/button";
import { Moon, Languages, Settings2Icon } from "lucide-react";
import { toggleTheme } from "@/helpers/theme_helpers";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import langs from "@/localization/langs";
import { PlusIcon } from "@radix-ui/react-icons";
import { useSettings } from "@/hooks/useSettings";
import { ChatSettings } from "./chat/ChatSettings";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { eventEmitter, Events } from "@/helpers/events";
import { PanelLeftIcon } from "lucide-react";




// I use shadcnui sidebar for this , im still learning how to use it it might be a bit messy, any PRs are welcome!

export function AppSidebar() {
    const { t, i18n } = useTranslation();
    const language = getLanguage();
    const { open } = useSidebar();
    const [showSettings, setShowSettings] = React.useState(false);
    const { settings, updateSettings } = useSettings();
    const { toggleSidebar } = useSidebar()
    const handleLanguageChange = (langKey: string) => {
        setAppLanguage(langKey, i18n);
    };

    const handleNewChat = useCallback(() => {
        eventEmitter.emit(Events.NEW_CHAT);
    }, []);

    return (
        <>
            <Sidebar
                side="right"
                dir={language === "fa" ? "rtl" : "ltr"}
                collapsible="icon"
                className="border-l flex flex-col items-center font-yekan-bakh overflow-hidden h-[calc(100vh-32px)] mt-8 border-t"
                style={{ "--sidebar-width-icon": "4rem" } as React.CSSProperties}
            >
                <SidebarHeader className="w-full">
                    <div className={cn(
                        "flex items-center w-full px-2 mb-4",
                        open ? "justify-between" : "justify-center"
                    )}>
                        {open ? (
                            <>
                                <SidebarTrigger
                                    aria-label={t("sidebar.collapse")}
                                    className="size-6"
                                />
                                <IconMehr className="text-primary size-6 mt-2" />
                            </>
                        ) : (
                            <IconMehr className="text-primary size-6 mt-2" />
                        )}
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <div className="flex flex-col px-3 gap-2">
                        {!open && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="justify-center p-3 w-full"
                                        onClick={toggleSidebar}
                                    >
                                        <PanelLeftIcon className="size-5 text-foreground" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="left" className="font-yekan-bakh">{t("sidebar.open")}</TooltipContent>
                            </Tooltip>
                        )}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start gap-2",
                                        !open && "justify-center p-3"
                                    )}
                                    onClick={handleNewChat}
                                >
                                    <PlusIcon className="text-foreground size-5" />
                                    {open && t("sidebar.newChat")}
                                </Button>
                            </TooltipTrigger>
                            {!open && <TooltipContent side="left" className="font-yekan-bakh">{t("sidebar.newChat")}</TooltipContent>}
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start gap-2",
                                        !open && "justify-center p-3"
                                    )}
                                    onClick={() => setShowSettings(true)}
                                >
                                    <Settings2Icon className="text-foreground size-5" />
                                    {open && t("chatSettings.title")}
                                </Button>
                            </TooltipTrigger>
                            {!open && <TooltipContent side="left" className="font-yekan-bakh">{t("chatSettings.title")}</TooltipContent>}
                        </Tooltip>
                    </div>
                </SidebarContent>
                <SidebarFooter className="border-t px-3 py-2 w-full">
                    <div className="flex flex-col gap-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start gap-2",
                                        !open && "justify-center p-3"
                                    )}
                                    onClick={toggleTheme}
                                >
                                    <Moon size={open ? 16 : 24} />
                                    {open && t("sidebar.toggleTheme")}
                                </Button>
                            </TooltipTrigger>
                            {!open && <TooltipContent className="font-yekan-bakh" side="left">{t("sidebar.toggleTheme")}</TooltipContent>}
                        </Tooltip>
                        <DropdownMenu>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start gap-2",
                                                !open && "justify-center p-3"
                                            )}
                                        >
                                            <Languages size={open ? 16 : 24} />
                                            {open && t("sidebar.language")}
                                        </Button>
                                    </DropdownMenuTrigger>
                                </TooltipTrigger>
                                {!open && <TooltipContent side="left" className="font-yekan-bakh">{t("sidebar.language")}</TooltipContent>}
                            </Tooltip>
                            <DropdownMenuContent align={open ? "end" : "start"} className={cn(
                                "w-56 font-yekan-bakh",
                                !open && "mr-2"
                            )}>
                                {langs.map((lang) => (
                                    <DropdownMenuItem
                                        key={lang.key}
                                        className={cn(
                                            "cursor-pointer",
                                            i18n.language === lang.key && "bg-muted"
                                        )}
                                        onClick={() => handleLanguageChange(lang.key)}
                                    >
                                        <span className="mr-2">{lang.prefix}</span>
                                        {lang.nativeName}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </SidebarFooter>
            </Sidebar>

            <ChatSettings
                open={showSettings}
                onOpenChange={setShowSettings}
                streaming={settings.streaming}
                temperature={settings.temperature}
                maxTokens={settings.maxTokens}
                onStreamingChange={(value) => updateSettings({ streaming: value })}
                onTemperatureChange={(value) => updateSettings({ temperature: value })}
                onMaxTokensChange={(value) => updateSettings({ maxTokens: value })}
            />
        </>
    );
}