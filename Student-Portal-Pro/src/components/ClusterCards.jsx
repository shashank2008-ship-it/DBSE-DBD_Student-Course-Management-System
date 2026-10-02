import React from 'react';
export default function ClusterCards({clusters,selectedId,onSelect,busy=false,locked=false,admin=false}){
 return <div className="cluster-grid">{clusters.map((c,i)=><article className={`cluster-card tone-${i%4} ${selectedId===c.id?'cluster-selected':''}`} key={c.id}>
 <div className="cluster-top"><span className="cluster-symbol">{c.code}</span><span className="badge badge-neutral">{selectedId===c.id?(locked?'Selected · locked':'Selected'):c.semester}</span></div>
 <h2>{c.name}</h2><p>{c.description}</p><div className="cluster-groups">{c.groups.map(g=><span key={g.id}>{g.name}</span>)}</div>
 <div className="cluster-metrics"><div><strong>{c.groups.length}</strong><span>Section groups</span></div><div><strong>{c.courseCount}</strong><span>Subjects</span></div><div><strong>{c.studentCount}</strong><span>Students</span></div></div>
 {onSelect&&<button className={`btn ${selectedId===c.id?'btn-secondary':'btn-primary'}`} disabled={busy||locked||selectedId===c.id} onClick={()=>onSelect(c.id)}>{selectedId===c.id?'Your cluster':locked?'Selection locked':`Choose ${c.code}`}</button>}
 {admin&&<span className="cluster-caption">{c.sections.reduce((n,s)=>n+Number(s.filled_seats),0)} active enrollments · {c.sections.reduce((n,s)=>n+Number(s.total_seats),0)} seats</span>}
 </article>)}</div>;
}
