from django.db import migrations

import apps.security.fields


def encrypt_existing_records(apps, schema_editor):
    MpesaTransaction = apps.get_model("mpesa", "MpesaTransaction")

    for record in MpesaTransaction.objects.all().iterator():
        record.save(update_fields=["phone_number", "raw_payload"])


class Migration(migrations.Migration):

    dependencies = [
        ("mpesa", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="mpesatransaction",
            name="phone_number",
            field=apps.security.fields.EncryptedTextField(max_length=15),
        ),
        migrations.AlterField(
            model_name="mpesatransaction",
            name="raw_payload",
            field=apps.security.fields.EncryptedJSONField(default=dict),
        ),
        migrations.RunPython(encrypt_existing_records, migrations.RunPython.noop),
    ]