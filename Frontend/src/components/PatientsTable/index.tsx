import { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
    Box,
    IconButton,
    TableCell,
    TablePagination,
    TableSortLabel,
    Toolbar,
    Typography,
} from '@mui/material';
import { Container } from './styles';
import { usePatients } from '../../hooks/usePatients';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Patient } from '../../shared/types';
import { visuallyHidden } from '@mui/utils';
import { MaintainPatientModal } from '../MaintainPatientModal';
import { formatAddress } from '../../utils/formatAddress';
import { formatDate } from '../../utils/formatDate';

function stableSort<T>(
    array: readonly T[],
    comparator: (a: T, b: T) => number
) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

function getComparator<Key extends keyof any>(
    order: 'asc' | 'desc',
    orderBy: Key
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string }
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof Patient;
    label: string;
    numeric: boolean;
}
const headCells: readonly HeadCell[] = [
    {
        id: 'name',
        numeric: false,
        disablePadding: false,
        label: 'Nome',
    },
    {
        id: 'email',
        numeric: false,
        disablePadding: false,
        label: 'Email',
    },
    {
        id: 'birthDate',
        numeric: false,
        disablePadding: false,
        label: 'Data de Nascimento',
    },
    {
        id: 'streetAddress',
        numeric: false,
        disablePadding: false,
        label: 'Endereço',
    },
    {
        id: 'createdAt',
        numeric: false,
        disablePadding: false,
        label: 'Data de Cadastro',
    },
];

interface EnhancedTableProps {
    onRequestSort: (
        event: React.MouseEvent<unknown>,
        property: keyof Patient
    ) => void;
    order: 'asc' | 'desc';
    orderBy: string;
}
function EnhancedTableHead(props: EnhancedTableProps) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler =
        (property: keyof Patient) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

    return (
        <TableHead sx={{ width: '100%', mb: 2, paddingX: 2, paddingY: 2 }}>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align="left"
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc'
                                        ? 'sorted descending'
                                        : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
                <TableCell align="center">Ações</TableCell>
            </TableRow>
        </TableHead>
    );
}

export default function PatientsTable() {
    /* Pacientes */
    const { patients, deletePatient } = usePatients();
    const [patientToEdit, setPacientToEdit] = useState<Patient>();

    /* Formats patients address and date for listing */
    const formattedPatients = patients.map((patient: Patient) => ({
        ...patient,
        formattedBirthDate: formatDate(new Date(patient.birthDate)),
        formattedCreationDate: formatDate(new Date(patient.createdAt)),
        formattedAddress: formatAddress(patient),
    }));

    /* Paginação e Filtros */
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [orderBy, setOrderBy] = useState<keyof Patient>('name');

    /* Modal */
    const [openModal, setOpenModal] = useState(false);

    const onCloseModal = () => {
        setOpenModal(false);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Patient
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    return (
        <>
            <Container>
                <Paper sx={{ width: '100%', mb: 2, paddingX: 2, paddingY: 2 }}>
                    <Toolbar
                        sx={{
                            pl: { sm: 2 },
                            pr: { xs: 1, sm: 1 },
                        }}
                    >
                        <Typography
                            sx={{ flex: '1 1 100%' }}
                            variant="h6"
                            id="tableTitle"
                            component="div"
                        >
                            Pacientes
                        </Typography>
                    </Toolbar>
                    <Table sx={{ minWidth: 800 }} aria-label="simple table">
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                        />
                        <TableBody>
                            {formattedPatients.length > 0 ? (
                                stableSort(
                                    formattedPatients,
                                    getComparator(order, orderBy)
                                )
                                    .slice(
                                        page * rowsPerPage,
                                        page * rowsPerPage + rowsPerPage
                                    )
                                    .map((patient) => {
                                        return (
                                            <TableRow
                                                hover
                                                tabIndex={-1}
                                                key={patient.id}
                                            >
                                                <TableCell
                                                    align="left"
                                                    width="20%"
                                                >
                                                    {patient.name}
                                                </TableCell>
                                                <TableCell align="left">
                                                    {patient.email}
                                                </TableCell>
                                                <TableCell align="left">
                                                    {patient.formattedBirthDate}
                                                </TableCell>
                                                <TableCell
                                                    align="left"
                                                    width="20%"
                                                >
                                                    {patient.formattedAddress}
                                                </TableCell>
                                                <TableCell align="left">
                                                    {
                                                        patient.formattedCreationDate
                                                    }
                                                </TableCell>
                                                <TableCell
                                                    align="center"
                                                    width="12%"
                                                >
                                                    <IconButton
                                                        aria-label="editar"
                                                        title="Editar"
                                                        color="primary"
                                                        onClick={() => {
                                                            setOpenModal(true);
                                                            setPacientToEdit(
                                                                patient
                                                            );
                                                        }}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        aria-label="deletar"
                                                        title="Deletar"
                                                        color="primary"
                                                        onClick={() => {
                                                            deletePatient(
                                                                patient.id
                                                            );
                                                        }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                            ) : (
                                <TableRow hover>
                                    <TableCell align="center" colSpan={6}>
                                        {'Nenhum registro foi encontrado.'}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={
                            formattedPatients.length >= 5 ? [5, 10, 25] : []
                        }
                        component="div"
                        count={formattedPatients ? formattedPatients.length : 0}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Pacientes por página:"
                        labelDisplayedRows={({ from, to, count }) => {
                            return `Exibindo ${from}-${to} de ${
                                count !== -1 ? count : `mais de ${to}`
                            }`;
                        }}
                    />
                </Paper>
            </Container>
            <MaintainPatientModal
                isOpen={openModal}
                onRequestClose={onCloseModal}
                patientToEdit={patientToEdit}
            />
        </>
    );
}
