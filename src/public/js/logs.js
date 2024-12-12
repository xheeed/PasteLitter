
// <table class="logs-table">
// <tr class="log-row">
//     <th>Username</th>
//     <th>Action</th>
//     <th>Date</th>
// </tr>

// <tr class="log-row-data">

// </tr>

// </table>

$(document).ready(function() {
    $.ajax({
        url: '/api/logs',
        method: 'GET',
        success: function(data) {
            if (data.status === 'success') {
                const logs = data.data;
                for (const log of logs.reverse()) {
                    $('.logs-table').append(`
                        <tr class="log-row-data">
                            <td>${log.username}</td>
                            <td>${log.action_desc}</td>
                            <td>${new Date(log.created_at).toLocaleString()}</td>
                        </tr>
                    `);
                }
            }
        },
        error: function(error) {
            console.log(error);
        }
    });
});

