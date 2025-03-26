import {useEffect, useState} from "react";
import {DefaultSort} from "../../constants/sort";
import useSWR from "swr";
import Breadcrumb from "../../components/Breadcrumb";
import {
    Box, Button, ButtonGroup,
    Card,
    CardContent,
    CircularProgress, Fab, IconButton, Pagination,
    Stack,
    Table, TableBody, TableCell,
    TableContainer,
    TableHead,
    TableRow, Tooltip
} from "@mui/material";
import moment from 'moment';
import EnhancedTableToolbar from "../../components/table/EnhancedTableToolbar";
import CustomCheckbox from "../../components/forms/CustomCheckbox";
import {Link} from "react-router-dom";
import {AddRounded, EditRounded} from "@mui/icons-material";
import DeleteConfirmDialog from "../../components/dialogs/DeleteConfirmDialog";
import {DeleteAttendance, GetAttendancesByQuery} from "../../service/attendance";
import {DefaultSwrOptions, Role} from "../../constants/constants";
import {useSelector} from "react-redux";

export default function Attendance() {
    const { role, profile } = useSelector(state => state.profile);

    const [filter, setFilter] = useState({sort: DefaultSort.newest.value });
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);

    const { data: resData, isLoading: loading, mutate } = useSWR(['/api/attendance', filter],
        () => GetAttendancesByQuery(filter), DefaultSwrOptions);

    useEffect(() => {
        if (role === Role.employee.value) {
            setFilter({...filter, userId: profile?.id});
        }
    }, [role, profile]);

    const handleSelectItems = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(e => e !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const handleSelectTime = (time) => {
        setFilter({ time: time });
    };

    const handleDelete = () => {
        return DeleteAttendance(selectedItems.join(',')).then((res) => {
            if (res.status === 200) {
                mutate();
                setDeleteConfirm(false);
                setSelectedItems([]);
            }
        });
    }

    return (
        <>
            <Breadcrumb
                title="Attendances"
                items={[
                    { to: '/app', title: 'Dashboard' },
                    { title: 'Attendances' },
                ]}/>
            <Card>
                <CardContent>
                    <EnhancedTableToolbar
                        filter={filter}
                        numSelected={selectedItems.length}
                        handleChange={(newFilter) => setFilter({...filter, ...newFilter})}
                        sortItems={DefaultSort}
                        onDelete={() => setDeleteConfirm(true)}
                        actions={
                            <ButtonGroup variant="outlined" size="small">
                                <Button
                                    onClick={() => handleSelectTime('today')}
                                    variant={filter?.time === 'today' ? 'contained' : 'outlined'}>Today</Button>
                                <Button
                                    sx={{ width: 100 }}
                                    onClick={() => handleSelectTime('week')}
                                    variant={filter?.time === 'week' ? 'contained' : 'outlined'}>This Week</Button>
                                <Button
                                    sx={{ width: 100 }}
                                    onClick={() => handleSelectTime('month')}
                                    variant={filter?.time === 'month' ? 'contained' : 'outlined'}>This Month</Button>
                            </ButtonGroup>
                        }>
                    </EnhancedTableToolbar>
                    {loading || loading === undefined ? (
                        <Stack alignItems="center">
                            <Box height={20}/>
                            <CircularProgress size={32}/>
                        </Stack>
                    ) : (
                        <>
                            <TableContainer>
                                <Table sx={{ whiteSpace: 'nowrap' }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell/>
                                            <TableCell>User</TableCell>
                                            <TableCell>Check In</TableCell>
                                            <TableCell>Check Out</TableCell>
                                            <TableCell align="right">Option</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {resData?.data?.data?.length > 0 ? resData?.data?.data?.map((row, i) => (
                                            <TableRow key={i}>
                                                <TableCell padding="checkbox">
                                                    <CustomCheckbox
                                                        color="primary"
                                                        checked={selectedItems.includes(row._id)}
                                                        onChange={() => handleSelectItems(row._id)}/>
                                                </TableCell>
                                                <TableCell>{row.user?.name ?? '-'}</TableCell>
                                                <TableCell>{moment(row.checkIn).format('DD MMM YYYY hh:mm')}</TableCell>
                                                <TableCell>{row.checkOut ? moment(row.checkOut).format('DD MMM YYYY hh:mm') : '-'}</TableCell>
                                                <TableCell align="right">
                                                    <Link to={`/app/attendance/${row._id}/update`}>
                                                        <Tooltip title="Edit">
                                                            <IconButton>
                                                                <EditRounded fontSize="small" sx={{ color: 'text.secondary'}}/>
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        )) : (
                                            <TableRow>
                                                <TableCell colSpan={7} align="center">No Data</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Stack direction="row" paddingTop={3} justifyContent="end">
                                <Pagination
                                    color="secondary"
                                    count={resData?.data?.pagination?.pages ?? 1}
                                    page={parseInt(resData?.data?.pagination?.page)}
                                    size="small"
                                    onChange={(e, val) => setFilter({...filter, page: val})}/>
                            </Stack>
                        </>
                    )}
                </CardContent>
            </Card>

            <Link to={`/app/attendance/create`}>
                <Tooltip title="Add Data">
                    <Fab
                        color="primary"
                        aria-label="add"
                        sx={{ position: "fixed", right: "25px", bottom: "15px" }}>
                        <AddRounded />
                    </Fab>
                </Tooltip>
            </Link>

            <DeleteConfirmDialog
                open={deleteConfirm}
                onClose={() => setDeleteConfirm(false)}
                onSubmit={handleDelete}/>
        </>
    )
}