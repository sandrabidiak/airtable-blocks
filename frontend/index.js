import { initializeBlock, useBase, useRecords, expandRecord, useGlobalConfig, TextButton, FieldPickerSynced, TablePickerSynced, Box, RecordCardList, ViewPickerSynced } from '@airtable/blocks/ui'
import React from 'react'

function TodoBlock() {
    const base = useBase()
    const globalConfig = useGlobalConfig()
    const tableId = globalConfig.get('selectedTableId')
    const viewId = globalConfig.get('selectedViewId')
    const completedFieldId = globalConfig.get('completedFieldId')

    const table = base.getTableByIdIfExists(tableId)
    const view = table ? table.getViewByIdIfExists(viewId) : null
    const completedField = table ? table.getFieldByIdIfExists(completedFieldId) : null

    const toggle = (record) => {
        table.updateRecordAsync (
            record, {[completedFieldId]: !record.getCellValue(completedFieldId)}
        )
    }

    const records = useRecords(view)
    

    const opts = {
        sorts: [
            {field: table.getFieldByName('Amount'), direction: 'desc'},
            {field: table.getFieldByName('Name')}
        ],
        fields: [
            completedFieldId
        ],
    }
    
    const recordResults = useRecords(table, opts)


    const tasks = records && completedField ? records.map(record => (
            <Task
                key={record.id}
                record={record}
                onToggle={toggle}
                completedFieldId={completedFieldId}
            />
        )) : null

    return (
        <div>
            <TablePickerSynced globalConfigKey="selectedTableId" />
            <ViewPickerSynced table={table} globalConfigKey="selectedViewId" />
            <FieldPickerSynced table={table} globalConfigKey="completedFieldId" />
            {tasks}
            <Box height="300px" border="thick" backgroundColor="lightGray1">
                <RecordCardList 
                    records={recordResults} 
                />
            </Box>
        </div>
    )
}

function Task({ record, completedFieldId, onToggle }) {
    const label = record.name || 'Unnamed record'
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 18,
                padding: 12,
                borderBottom: '1px solid #ddd',
            }}
        >
            <TextButton
                variant="dark"
                size="xlarge"
                onClick={() => {
                    onToggle(record);
                }}
            >
                {record.getCellValue(completedFieldId) ? <s>{label}</s> : label}
            </TextButton>            
            <TextButton
                icon="expand"
                aria-label="Expand record"
                variant="dark"
                onClick={() => {
                    expandRecord(record)
                }}
            />
        </div>
    )
}

initializeBlock(() => <TodoBlock />)
