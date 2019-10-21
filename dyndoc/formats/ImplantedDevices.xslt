<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns:xs="http://www.w3.org/2001/XMLSchema" 
    xmlns:fn="http://www.w3.org/2005/xpath-functions"
    xmlns:n="urn:com-cerner-patient-ehr:v3" 
    xmlns:cdocfx="urn:com-cerner-physician-documentation-functions" 
    xmlns:xr-date-formatter="java:com.cerner.xsl.util.XSLTDateUtilities" 
    xmlns:java-string="java:java.lang.String" 
    xmlns:dd="DynamicDocumentation" 
    exclude-result-prefixes="xsl xs fn n cdocfx xr-date-formatter java-string dd">

    <xsl:output method="html" encoding="UTF-8" indent="yes"/>
    <xsl:param as="xs:string" name="current-locale" select="'en_US'"/>

    <!-- required to include CommonFxn.xslt -->
    <!-- Comment this line to debug --> <xsl:include href="/cernerbasiccontent/formats/commonfxn.xslt"/> 
    <!--Uncomment this line to debug--> <!--<xsl:include href="CommonFxn.xslt"/> -->

    <xsl:variable name="ImplantedThisVisitTitle" select="'Implanted This Visit'"/>
    <xsl:variable name="ExplantedThisVisitTitle" select="'Removed This Visit'"/>
    <xsl:variable name="MRUnsafeAlert" select="'Notice: This patient has devices implanted this visit that are not MRI compatible.'"/>
    <xsl:variable name="MRPossiblyUnsafeAlert" select="'Notice: This patient has devices implanted this visit that may not be MR compatible.'"/>
    <xsl:variable name="UnknownDeviceTitle" select="'Unknown Device'"/>
    <xsl:variable name="UnknownProcedureTitle" select="'Undefined Procedure'"/>
    <xsl:variable name="UndefinedBodySiteTitle" select="'Body Site Undefined'"/>
    <xsl:variable name="QuantityDisplayFormat" select="' (%s)'"/>
    <xsl:variable name="UDIDisplayFormat" select="' - UDI: %s'"/>
    <xsl:variable name="commaDisplay" as="xs:string" select="', %s'"/>
    <xsl:variable name="PatientFacing" as="xs:boolean" select="false()"/>

    <!-- Date display sequences, need to be overridden in i18n file -->
    <xsl:variable name="DATE_ONLY_SEQUENCE" as="xs:string" select="'MM/dd/yyyy'"/>
    <xsl:variable name="MONTH_YEAR_SEQUENCE" as="xs:string" select="'MM/yyyy'"/>
    <xsl:variable name="YEAR_SEQUENCE" as="xs:string" select="'yyyy'"/>

    <xsl:variable name="ImplantableDevices" select="n:report/n:clinical-data/n:implantable-device-data/n:implantable-device"/>
    <xsl:variable name="ImplantedDevices" select="$ImplantableDevices[not(./n:explant-dt-tm)]"/>
    <xsl:variable name="ImplantedDevicesWithProcedures" select="$ImplantableDevices[not(./n:explant-dt-tm) and (@procedure-code or @procedure-freetext)]"/>
    <xsl:variable name="ImplantedDevicesWithoutProcedures" select="$ImplantableDevices[not(./n:explant-dt-tm) and not(@procedure-code or @procedure-freetext)]"/>
    <xsl:variable name="ExplantedDevices" select="$ImplantableDevices[./n:explant-dt-tm]"/>

    <!-- 
        Display a MR warning if devices are missing the MR classification or any devices have a non-MRSAFE code.
        Parameters: 
            devices - the device node list 
    -->
    <xsl:template name="tempDisplayMRWarning">
        <xsl:param name="devices"/>

        <xsl:variable name="noClassificationCount" select="count($devices[not(@manufacturer-classification-code)])"/>
        <xsl:variable name="unsafeCount" select="count($devices[exists(@manufacturer-classification-code) and 'MRUNSAFE' = cdocfx:getCodeMeanByID(@manufacturer-classification-code)])"/>
        <xsl:variable name="safeCount" select="count($devices[exists(@manufacturer-classification-code) and 'MRSAFE' = cdocfx:getCodeMeanByID(@manufacturer-classification-code)])"/>
        <xsl:variable name="deviceCount" select="count($devices)"/>

        <xsl:if test="($noClassificationCount &gt; 0) or ($unsafeCount &gt; 0) or ($deviceCount &gt; $safeCount)">
            <div style="font-weight:bold; color:red;">
                <xsl:choose>
                    <xsl:when test="$unsafeCount">
                        <xsl:value-of select="$MRUnsafeAlert"/>
                    </xsl:when>
                    <xsl:when test="not($safeCount = $deviceCount)">
                        <xsl:value-of select="$MRPossiblyUnsafeAlert"/>
                    </xsl:when>
                </xsl:choose>
            </div>
        </xsl:if>
    </xsl:template>
 
    <!-- 
        Display a fuzzy date with date precision, logic for regular date for legacy report data
    -->
    <xsl:function name="cdocfx:getFuzzyDateDisplay">
        <xsl:param name="fuzzyDateElement" as="element()?"/>
        <xsl:choose>
            <xsl:when test="$fuzzyDateElement/n:date">
                <xsl:variable name="datePrecision" as="xs:string" select="if($fuzzyDateElement/@precision-type)then $fuzzyDateElement/@precision-type else ''"/>
                <xsl:variable name="fuzzyDate" as="xs:dateTime" select="$fuzzyDateElement/n:date" />
                <xsl:variable name="timezone" as="xs:string" select="$fuzzyDateElement/n:date/@time-zone"/>
                <xsl:choose>
                    <!-- KNOWN ISSUE: Date precision in report is off by one precision more accurate -->
                    <!-- Do not send timezone since time is not accurate and can adjust dates back/forward incorrectly. -->
                    <xsl:when test="$datePrecision = 'DATE_AND_TIME'">
                        <xsl:value-of select="xr-date-formatter:formatDate($fuzzyDate, $DATE_ONLY_SEQUENCE, $current-locale)"/>
                    </xsl:when>
                    <xsl:when test="$datePrecision = 'DAY'">
                        <xsl:value-of select="xr-date-formatter:formatDate($fuzzyDate, $DATE_ONLY_SEQUENCE, $current-locale)"/>
                    </xsl:when>
                    <xsl:when test="$datePrecision = 'MONTH_AND_YEAR'">
                        <xsl:value-of select="xr-date-formatter:formatDate($fuzzyDate, $MONTH_YEAR_SEQUENCE, $current-locale)"/>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:value-of select="xr-date-formatter:formatDate($fuzzyDate, $YEAR_SEQUENCE, $current-locale)"/>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:when>
            <xsl:otherwise>
                <!-- regular date (deprecated for implant/explant dt tm), needed for import validation against old report -->
                <xsl:variable name="date" as="xs:dateTime" select="$fuzzyDateElement"/>
                <xsl:variable name="timezone" as="xs:string" select="if($fuzzyDateElement/@time-zone) then $fuzzyDateElement/@time-zone else '' "/>
                
                <xsl:value-of select="xr-date-formatter:formatDate($date, $DATE_ONLY_SEQUENCE, $current-locale)"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:function>
    
    <!-- 
        Display device details based on boolean indicators if the report has data for the detail.
		for implants 
			patient facing: (Quantity), implant date, MR Compat - UDI info
			provider facing: (Quantity), implant date, MR Compat
		for explants
			patient facing: (Quantity), explant date, explant reason - UDI info
			provider facing: (Quantity), explant date, explant reason
	-->
    <xsl:template name="tempDisplayDeviceDetails">
        <xsl:param name="device" as="node()"/>
        <xsl:param name="isExplant" as="xs:boolean"/>
        <xsl:param name="hasUdi" as="xs:boolean"/>
        <xsl:param name="hasMRCompatibility" as="xs:boolean"/>
        <xsl:param name="hasDate" as="xs:boolean"/>
        <xsl:param name="displayQuantity" as="xs:boolean"/>
        <xsl:param name="hasExplantReason" as="xs:boolean"/>

        <xsl:variable name="quantity" as="xs:string" select="$device/@implanted-quantity"/>
        <xsl:variable name="quantityDisplay" as="xs:string" select="if($displayQuantity) then java-string:format($QuantityDisplayFormat, $quantity) else ''"/>
        <xsl:variable name="implantDateDisplay" as="xs:string" select="if($hasDate and not($isExplant)) then cdocfx:getFuzzyDateDisplay($device/n:implanted-dt-tm) else ''"/>
        <xsl:variable name="explantDateDisplay" as="xs:string" select="if($hasDate and $isExplant) then cdocfx:getFuzzyDateDisplay($device/n:explant-dt-tm) else ''"/>
        <xsl:variable name="udi" as="xs:string" select="if($hasUdi) then $device/@udi else ''"/>
        <xsl:variable name="udiDisplay" as="xs:string" select="if($hasUdi) then java-string:format($UDIDisplayFormat, $udi) else ''"/>
        <xsl:variable name="explantReason" as="xs:string" select="if($hasExplantReason) then cdocfx:getCodeDisplayByID($device/@explant-reason-code) else ''"/>
        <xsl:variable name="mrCompatibility" as="xs:string" select="if($hasMRCompatibility)then cdocfx:getCodeDisplayByID($device/@manufacturer-classification-code) else ''"/>

        <xsl:choose>
            <xsl:when test="not($isExplant)">
                <xsl:if test="$displayQuantity">
                    <xsl:value-of select="$quantityDisplay"/>
                </xsl:if>

                <xsl:choose>
                    <xsl:when test="$displayQuantity and $hasDate">
                        <xsl:value-of select="java-string:format($commaDisplay, $implantDateDisplay)"/>
                    </xsl:when>
                    <xsl:when test="not($displayQuantity) and $hasDate">
                        <xsl:value-of select="java-string:format(' %s', $implantDateDisplay)"/>
                    </xsl:when>
                </xsl:choose>

                <xsl:choose>
                    <xsl:when test="($displayQuantity or $hasDate) and $hasMRCompatibility">
                        <xsl:value-of select="java-string:format($commaDisplay, $mrCompatibility)"/>
                    </xsl:when>
                    <xsl:when test="not($displayQuantity or $hasDate) and $hasMRCompatibility">
                        <xsl:value-of select="java-string:format(' %s', $mrCompatibility)"/>
                    </xsl:when>
                </xsl:choose>

                <xsl:if test="$PatientFacing and $hasUdi">
                    <xsl:value-of select="$udiDisplay"/>
                </xsl:if>
            </xsl:when>
            <xsl:otherwise>

                <xsl:if test="$displayQuantity">
                    <xsl:value-of select="$quantityDisplay"/>
                </xsl:if>

                <xsl:choose>
                    <xsl:when test="$displayQuantity and $hasDate">
                        <xsl:value-of select="java-string:format($commaDisplay, $explantDateDisplay)"/>
                    </xsl:when>
                    <xsl:when test="not($displayQuantity) and $hasDate">
                        <xsl:value-of select="java-string:format(' %s', $explantDateDisplay)"/>
                    </xsl:when>
                </xsl:choose>

                <xsl:choose>
                    <xsl:when test="($displayQuantity or $hasDate) and $hasExplantReason">
                        <xsl:value-of select="java-string:format($commaDisplay, $explantReason)"/>
                    </xsl:when>
                    <xsl:when test="not($displayQuantity or $hasDate) and $hasExplantReason">
                        <xsl:value-of select="java-string:format(' %s', $explantReason)"/>
                    </xsl:when>
                </xsl:choose>

                <xsl:if test="$PatientFacing and $hasUdi">
                    <xsl:value-of select="$udiDisplay"/>
                </xsl:if>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <!-- 
        Generate device entry 
        Parameters: 
     	  device - the device node 
    -->
    <xsl:template name="tempDisplayDeviceWithDetails">
        <xsl:param name="device"/>

        <xsl:attribute name="dd:entityid">
            <xsl:value-of select="$device/@history-id"/>
        </xsl:attribute>
        <xsl:attribute name="dd:contenttype">
            <xsl:text>IMP_DEVICES</xsl:text>
        </xsl:attribute>

        <!-- Device Title -->
        <xsl:value-of select="cdocfx:getDeviceTitle($device)"/>
        <xsl:call-template name="tempDisplayDeviceDetails">
            <xsl:with-param name="device" select="$device"/>
            <xsl:with-param name="isExplant" select="if($device/n:explant-dt-tm) then true() else false()"/>
            <xsl:with-param name="displayQuantity" select="$device/@implanted-quantity &gt; 1"/>
            <xsl:with-param name="hasDate" select="if($device/n:implanted-dt-tm or $device/n:explant-dt-tm) then true() else false()"/>
            <xsl:with-param name="hasMRCompatibility" select="if($device/@manufacturer-classification-code) then true() else false()"/>
            <xsl:with-param name="hasUdi" select="if($device/@udi) then true() else false()"/>
            <xsl:with-param name="hasExplantReason" select="if($device/@explant-reason-code) then true() else false()"/>
        </xsl:call-template>
    </xsl:template>

    <!-- Get Appropriate Title For Implant -->
    <!-- Parameters: -->
    <!-- 	device - the device node -->
    <xsl:function name="cdocfx:getDeviceTitle">
        <xsl:param name="device"/>

        <xsl:choose>
            <xsl:when test="$device/@item-display">
                <xsl:value-of select="$device/@item-display"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:choose>
                    <xsl:when test="$device/@item-freetext">
                        <xsl:value-of select="$device/@item-freetext"/>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:value-of select="$UnknownDeviceTitle"/>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:function>

    <!-- Generates list of Implants -->
    <!-- Parameters: -->
    <!-- 	devices - the device node list -->
    <!-- 	procedureTitle - title of the procedure -->
    <xsl:template name="tempDisplayImplantedDevices">
        <xsl:param name="devices"/>
        <xsl:param name="procedureTitle"/>

        <xsl:if test="count($devices) &gt; 0">
            <div class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right">
                <span style="font-weight:bold;">
                    <xsl:value-of select="$procedureTitle"/>
                </span>

                <xsl:for-each-group select="$devices" group-by="@body-site-code">
                    <xsl:sort select="cdocfx:getCodeDisplayByID(@body-site-code)"/>

                    <xsl:call-template name="tempDisplayDevicesByBodySite">
                        <xsl:with-param name="devices" select="current-group()"/>
                    </xsl:call-template>
                </xsl:for-each-group>

                <xsl:for-each-group select="$devices[not(@body-site-code)]" group-by="not(@body-site-code)">
                    <xsl:call-template name="tempDisplayDevicesByBodySite">
                        <xsl:with-param name="devices" select="current-group()"/>
                    </xsl:call-template>
                </xsl:for-each-group>
            </div>
        </xsl:if>
    </xsl:template>

    <!-- Display list of devices for single body site -->
    <!-- Parameters: -->
    <!-- 	devices - the device node list -->
    <xsl:template name="tempDisplayDevicesByBodySite">
        <xsl:param name="devices"/>

        <xsl:variable name="location">
            <xsl:value-of select="if(@body-site-code) then cdocfx:getCodeDisplayByID(@body-site-code) else $UndefinedBodySiteTitle"/>
        </xsl:variable>
        

        <div class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right" style="margin-left:1em;">
            <div><xsl:value-of select="$location"/></div>
            <ul style="list-style: disc; padding:0; margin:0; margin-left:2em;">
                <xsl:for-each select="$devices">
                    <xsl:sort select="if(current()/n:explant-dt-tm) then current()/n:explant-dt-tm else current()/n:implanted-dt-tm" order="ascending"/>
                    <xsl:sort select="cdocfx:getDeviceTitle(.)" order="ascending"/>
                    <li class="ddemrcontentitem ddremovable" dd:btnfloatingstyle="top-right" style="word-break:break-all;">
                        <xsl:call-template name="tempDisplayDeviceWithDetails">
                            <xsl:with-param name="device" select="."/>
                        </xsl:call-template>
                    </li>
                </xsl:for-each>
            </ul>
        </div>
    </xsl:template>

    <!-- Generates list of Explants -->
    <!-- Parameters: -->
    <!-- 	devices - the device node list -->
    <xsl:template name="tempDisplayExplantedDevices">
        <xsl:param name="devices"/>

        <div class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right">
            <xsl:for-each-group select="$devices[@body-site-code]" group-by="@body-site-code">
                <xsl:sort select="cdocfx:getCodeDisplayByID(@body-site-code)"/>

                <xsl:call-template name="tempDisplayDevicesByBodySite">
                    <xsl:with-param name="devices" select="current-group()"/>
                </xsl:call-template>
            </xsl:for-each-group>

            <xsl:for-each-group select="$devices[not(@body-site-code)]" group-by="not(@body-site-code)">
                <xsl:call-template name="tempDisplayDevicesByBodySite">
                    <xsl:with-param name="devices" select="current-group()"/>
                </xsl:call-template>
            </xsl:for-each-group>
        </div>
    </xsl:template>

    <!-- Generate appropriate title for a procedure -->
    <!-- Parameters: -->
    <!-- 	devices - the device node list -->
    <xsl:function name="cdocfx:ProcedureTitle">
        <xsl:param name="devices"/>

        <xsl:for-each select="$devices">
            <xsl:choose>
                <xsl:when test="@procedure-code">
                    <xsl:value-of select="cdocfx:getCodeDisplayByID(@procedure-code)"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:choose>
                        <xsl:when test="@procedure-freetext">
                            <xsl:value-of select="@procedure-freetext"/>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:value-of select="$UnknownProcedureTitle"/>
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:for-each>
    </xsl:function>

    <!-- Main -->
    <xsl:template match="/">
        <xsl:choose>
            <xsl:when test="n:report/n:clinical-data">
                <xsl:if test="count($ImplantedDevices) &gt; 0">
                    <!-- MR Warning Message -->
                    <xsl:call-template name="tempDisplayMRWarning">
                        <xsl:with-param name="devices" select="$ImplantedDevices"/>
                    </xsl:call-template>
                    <div class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right">
                        <xsl:if test="not($PatientFacing)">
                            <xsl:attribute name="style">
                                <xsl:value-of select="'margin-left:1em;'"/>
                            </xsl:attribute>
                        </xsl:if>
                        <span>
                            <xsl:attribute name="style" select="if($PatientFacing) then 'font-size:13pt;font-weight: bold;' else 'text-decoration:underline'"/>
                            <xsl:value-of select="$ImplantedThisVisitTitle"/>
                        </span>

                        <xsl:for-each-group select="$ImplantedDevicesWithProcedures" group-by="if(@procedure-code)  then cdocfx:getCodeDisplayByID(@procedure-code) else @procedure-freetext">
                            <xsl:sort select="if(@procedure-code) then cdocfx:getCodeDisplayByID(@procedure-code) else @procedure-freetext"/>

                            <!-- Implants with procedure defined -->
                            <div class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right">
                                <xsl:call-template name="tempDisplayImplantedDevices">
                                    <xsl:with-param name="devices" select="current-group()"/>
                                    <xsl:with-param name="procedureTitle" select="if(@procedure-code) then cdocfx:getCodeDisplayByID(@procedure-code) else @procedure-freetext"/>
                                </xsl:call-template>
                            </div>
                        </xsl:for-each-group>

                        <xsl:if test="count($ImplantedDevicesWithoutProcedures) &gt; 0">
                            <!-- Implants without procedure defined -->
                            <div class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right">
                                <xsl:call-template name="tempDisplayImplantedDevices">
                                    <xsl:with-param name="devices" select="$ImplantedDevicesWithoutProcedures"/>
                                    <xsl:with-param name="procedureTitle" select="$UnknownProcedureTitle"/>
                                </xsl:call-template>
                            </div>
                        </xsl:if>
                    </div>
                </xsl:if>
                <xsl:if test="count($ExplantedDevices) &gt; 0">
                    <div class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right">
                        <xsl:if test="not($PatientFacing)">
                            <xsl:attribute name="style">
                                <xsl:value-of select="'margin-left:1em;'"/>
                            </xsl:attribute>
                        </xsl:if>
                        <span>
                            <xsl:attribute name="style" select="if($PatientFacing) then 'font-size:13pt;font-weight: bold;' else 'text-decoration:underline'"/>
                            <xsl:value-of select="$ExplantedThisVisitTitle"/>
                        </span>
                        <xsl:call-template name="tempDisplayExplantedDevices">
                            <xsl:with-param name="devices" select="$ExplantedDevices"/>
                        </xsl:call-template>
                    </div>
                </xsl:if>
            </xsl:when>
        </xsl:choose>
    </xsl:template>
</xsl:stylesheet>
