import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const fieldTypes = ['String', 'Number', 'Nested'];
const defaultField = () => ({ key: '', type: 'String', children: [] });

const generateJSON = (fields) => {
  const res = {};
  fields.forEach(f => {
    if (f.type === 'Nested') res[f.key || ''] = generateJSON(f.children);
    else res[f.key || ''] = f.type === 'String' ? '' : 0;
  });
  return res;
};

function FieldEditor({ fields, setFields }) {
  const update = (i, uf) => setFields(fields.map((f, idx) => idx === i ? uf : f));
  const add = () => setFields([...fields, defaultField()]);
  const remove = (i) => setFields(fields.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-4">
      {fields.map((f, i) => (
        <Card key={i} className="p-4 space-y-2">
          <div className="flex gap-2">
            <Input placeholder="Field Key" value={f.key} onChange={e => update(i, { ...f, key: e.target.value })} />
            <Select value={f.type} onValueChange={val => update(i, { ...f, type: val, children: val === 'Nested' ? f.children : [] })}>
              <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>{fieldTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
            <Button variant="destructive" onClick={() => remove(i)}>Delete</Button>
          </div>
          {f.type === 'Nested' && (
            <div className="ml-4 border-l pl-4">
              <FieldEditor fields={f.children} setFields={newC => update(i, { ...f, children: newC })} />
            </div>
          )}
        </Card>
      ))}
      <Button onClick={add}>Add Field</Button>
    </div>
  );
}

export default function JSONSchemaBuilder() {
  const [fields, setFields] = useState([]);
  return (
    <Tabs defaultValue="builder">
      <TabsList>
        <TabsTrigger value="builder">Schema Builder</TabsTrigger>
        <TabsTrigger value="json">JSON Preview</TabsTrigger>
      </TabsList>
      <TabsContent value="builder"><FieldEditor fields={fields} setFields={setFields} /></TabsContent>
      <TabsContent value="json">
        <Card><CardContent><pre>{JSON.stringify(generateJSON(fields), null, 2)}</pre></CardContent></Card>
      </TabsContent>
    </Tabs>
  );
}