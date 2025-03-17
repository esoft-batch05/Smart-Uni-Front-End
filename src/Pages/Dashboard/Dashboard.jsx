import React from "react";
import { Box, Card, CardContent, Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import EventCalendar from "../../Components/Calender/EventCalender";
import TodoList from "../../Components/TODO List/Todo";

export default function Dashboard() {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={8}>
          <EventCalendar />
        </Grid>
        <Grid item xs={12} md={4}>
          <TodoList />
        </Grid>
        <Grid item xs={12} md={4}>
          
        </Grid>
        <Grid item xs={12}>
          
        </Grid>
      </Grid>
    </Box>
  );
}