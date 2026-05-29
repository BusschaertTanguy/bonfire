import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type TableRootProps = ComponentProps<"table">;

const Root = ({ children, className, ...props }: TableRootProps) => {
    return (
        <table
            {...props}
            className={cn(
                "border-primary table-auto border-collapse border",
                className
            )}
        >
            {children}
        </table>
    );
};

type TableHeadProps = ComponentProps<"thead">;

const Head = ({ children, className, ...props }: TableHeadProps) => {
    return (
        <thead {...props} className={cn("", className)}>
            <tr>{children}</tr>
        </thead>
    );
};

type TableHeadCellProps = ComponentProps<"th">;

const HeadCell = ({ children, className, ...props }: TableHeadCellProps) => {
    return (
        <th
            {...props}
            className={cn(
                "border-primary border px-2 py-1 text-left",
                className
            )}
        >
            {children}
        </th>
    );
};

type TableBodyProps = ComponentProps<"tbody">;

const Body = ({ children, className, ...props }: TableBodyProps) => {
    return (
        <tbody {...props} className={cn("", className)}>
            {children}
        </tbody>
    );
};

type TableRowProps = ComponentProps<"tr">;

const Row = ({ children, className, ...props }: TableRowProps) => {
    return (
        <tr {...props} className={cn("", className)}>
            {children}
        </tr>
    );
};

type TableRowCellProps = ComponentProps<"td">;

const RowCell = ({ children, className, ...props }: TableRowCellProps) => {
    return (
        <td
            {...props}
            className={cn("border-primary border px-2 py-1", className)}
        >
            {children}
        </td>
    );
};

const Table = { Root, Head, HeadCell, Body, Row, RowCell };

export default Table;
