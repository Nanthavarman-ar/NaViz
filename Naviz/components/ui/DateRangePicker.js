"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { format } from "date-fns";
import { Calendar } from "./calendar";
import { Button } from "./button";
import { Input } from "./input";
function DateRangePicker() {
    const [range, setRange] = React.useState(undefined);
    const formatDate = (date) => {
        return date ? format(date, "MM/dd/yyyy") : "";
    };
    const clearRange = () => {
        setRange(undefined);
    };
    return (_jsxs("div", { className: "flex flex-col space-y-4", children: [_jsxs("div", { className: "flex space-x-2", children: [_jsx(Input, { type: "text", readOnly: true, placeholder: "Start date", value: formatDate(range?.from), className: "w-40", "aria-label": "Start date" }), _jsx(Input, { type: "text", readOnly: true, placeholder: "End date", value: formatDate(range?.to), className: "w-40", "aria-label": "End date" }), _jsx(Button, { variant: "outline", size: "sm", onClick: clearRange, children: "Clear" })] }), _jsx(Calendar, { mode: "range", selected: range, onSelect: (selectedRange) => {
                    setRange(selectedRange);
                } })] }));
}
export { DateRangePicker };
